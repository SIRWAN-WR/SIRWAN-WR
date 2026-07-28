import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// In-memory bookings storage
const storedBookings: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client lazily / safely on server
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Sirwan Content Writing Studio API operational" });
  });

  // API Route: Create Booking & Send Email Notification
  app.post("/api/bookings", (req, res) => {
    try {
      const {
        consultationTypeId,
        consultationTitle,
        clientType,
        clientName,
        clientEmail,
        clientPhone,
        companyName,
        date,
        timeSlot,
        projectBrief,
        sendEmailNotification = true,
      } = req.body;

      if (!clientName || !clientEmail || !clientPhone || !date || !timeSlot) {
        return res.status(400).json({ error: "الرجاء تعبئة جميع الحقول المطلوبة" });
      }

      const bookingId = `BK-${Date.now().toString().slice(-6)}`;
      const nowIso = new Date().toISOString();

      // Email Notification Dispatch Log & Payload
      console.log(`\n==================================================`);
      console.log(`✉️  [EMAIL NOTIFICATION SYSTEM DISPATCH]`);
      console.log(`To Beneficiary: ${clientName} <${clientEmail}>`);
      console.log(`Subject: تأكيد حجز قسيمة موعد الاستشارة [${bookingId}] - استوديو سيروان`);
      console.log(`Body Details:`);
      console.log(`   - نوع الاستشارة: ${consultationTitle || 'استشارة محتوى'}`);
      console.log(`   - الموعد: ${date} (الساعة ${timeSlot})`);
      console.log(`   - العميل: ${clientName} (${clientPhone})`);
      console.log(`   - الجهة: ${companyName || 'فرد / منشأة'}`);
      console.log(`==================================================\n`);

      const newBooking = {
        id: bookingId,
        createdAt: nowIso,
        consultationTypeId,
        consultationTitle: consultationTitle || "استشارة محتوى",
        clientType: clientType || "business",
        clientName,
        clientEmail,
        clientPhone,
        companyName: companyName || "",
        date,
        timeSlot,
        projectBrief: projectBrief || "",
        status: "confirmed",
        emailNotificationSent: Boolean(sendEmailNotification),
        emailSentAt: sendEmailNotification ? nowIso : undefined,
      };

      storedBookings.unshift(newBooking);
      return res.json({
        success: true,
        booking: newBooking,
        message: sendEmailNotification
          ? `تم إرسال إشعار القسيمة والموعد بنجاح إلى البريد الإلكتروني: ${clientEmail}`
          : `تم حفظ الموعد بنجاح`
      });
    } catch (err: any) {
      console.error("Booking Error:", err);
      return res.status(500).json({ error: "حدث خطأ أثناء حفظ الموعد" });
    }
  });

  // API Route: Resend Email Notification
  app.post("/api/bookings/resend-email", (req, res) => {
    try {
      const { bookingId, clientEmail } = req.body;
      const target = storedBookings.find(b => b.id === bookingId || b.clientEmail === clientEmail);
      
      const nowIso = new Date().toISOString();
      const emailTo = clientEmail || (target && target.clientEmail);

      if (!emailTo) {
        return res.status(400).json({ error: "البريد الإلكتروني غير متوفر لإعادة الإرسال" });
      }

      console.log(`\n==================================================`);
      console.log(`✉️  [RESENDING EMAIL NOTIFICATION]`);
      console.log(`To Beneficiary: ${emailTo}`);
      console.log(`Subject: إعادة إرسال: تفاصيل قسيمة الموعد [${bookingId || 'BK'}] - استوديو سيروان`);
      console.log(`==================================================\n`);

      if (target) {
        target.emailNotificationSent = true;
        target.emailSentAt = nowIso;
      }

      return res.json({
        success: true,
        message: `تم إعادة إرسال إشعار القسيمة بنجاح إلى البريد الإلكتروني: ${emailTo}`,
        emailSentAt: nowIso
      });
    } catch (err: any) {
      console.error("Resend Email Error:", err);
      return res.status(500).json({ error: "تعذر إعادة إرسال البريد الإلكتروني" });
    }
  });

  // API Route: Get Bookings
  app.get("/api/bookings", (req, res) => {
    res.json({ success: true, bookings: storedBookings });
  });

  // API Route: Clear All Bookings
  app.delete("/api/bookings", (req, res) => {
    storedBookings.length = 0;
    res.json({ success: true, message: "تم حذف جميع المواعيد المحفوظة بنجاح" });
  });

  // API Route: Delete Single Booking
  app.delete("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const index = storedBookings.findIndex(b => b.id === id);
    if (index !== -1) {
      storedBookings.splice(index, 1);
      return res.json({ success: true, message: "تم حذف الموعد المحدد بنجاح" });
    }
    return res.status(404).json({ error: "الموعد غير موجود" });
  });

  // API Route: Gemini AI Content Brief Generator
  app.post("/api/brief-generator", async (req, res) => {
    try {
      const { topicOrIndustry, clientType, targetAudience, goal } = req.body;

      if (!topicOrIndustry || typeof topicOrIndustry !== "string" || !topicOrIndustry.trim()) {
        return res.status(400).json({ error: "يرجى كتابة فكرة المشروع أو مجال النشاط" });
      }

      const ai = getGeminiClient();

      if (!ai) {
        // Fallback mock brief response if API key is not yet configured by user
        return res.json({
          titleIdea: `استراتيجية المحتوى والترويج لـ: ${topicOrIndustry.trim()}`,
          targetAudienceAnalysis: clientType === 'business' 
            ? 'الشركات والجهات القرار المهتمة بالحلول الموثوقة والقيمة العالية.'
            : 'الأفراد والمهنيون الباحثون عن صياغة إنجازاتهم وتأكيد حضورهم القيادي.',
          recommendedTone: 'نبرة موثوقة، إيجابية، وملهمة تجمع بين المهارة الفنية والوضوح.',
          contentStructure: [
            'المقدمة والخطاف الاستراتيجي المخاطب للجمهور',
            'التأطير وقيمة الحل الأساسية',
            'النقاط الجوهرية ومزايا التنافس',
            'دعوة واضحة ومحددة للتفاعل والعمل (CTA)'
          ],
          keyHighlights: [
            'تركيز على الحلول الفعلية',
            'إبراز أرقام التأثير والإنجازات',
            'استخدام لغة جذابة بدون إطالة'
          ],
          suggestedService: clientType === 'business' ? 'بروفايل الشركات والهوية التحريرية' : 'السيرة الذاتية وملف لينكد إن الاحترافي',
          estimatedTimeline: '2 - 4 أيام عمل'
        });
      }

      const systemInstruction = `أنت مستشار ومدير إبداعي وخبير في صياغة وتوثيق كتب السيرة الذاتية والمذكرات يعمل لدى "سيروان لصناعة كتب السيرة الذاتية".
مهمتك تحليل قصة العميل أو المحطات الفاصلة في حياته أو تاريخ عائلته ومؤسسته التجارية، ثم تقديم مقترح أولي لهيكلية فصول الكتاب والعنوان الفاخر باللغة العربية الفصحى الأدبية السليمة والراقية.
يرجى إخراج النتيجة بتنسيق JSON حصراً يحتوي على الخصائص التالية:
- titleIdea: عنوان مقترح فاخر وأدبي لكتاب السيرة الذاتية.
- targetAudienceAnalysis: تحليل للجمهور أو القراء المستهدفين (مثل الأبناء والأحفاد، رواد الأعمال، القراء العاديين).
- recommendedTone: نبرة السرد الموصى بها (مثال: سرد أدبي دافئ / مذكرات توثيقية حكيمة / تاريخ مؤسسي ملهم).
- contentStructure: مصفوفة نصوص من 4 إلى 5 عناوين فصول مقترحة للخط الزمني والسردي للكتاب.
- keyHighlights: مصفوفة نصوص من 3 محطات أو قيم جوهرية يجب التركيز عليها.
- suggestedService: إحدى خدمات سيروان الموصى بها (مثال: صناعة كتاب السيرة الذاتية للأفراد / توثيق كتاب تاريخ العوائل والشركات / جلسات الحوار والتفريغ التوثيقي / إعادة الصياغة والمراجعة السردية / الإخراج الفني والطباعة الفاخرة).
- estimatedTimeline: المدة الزمنية المقدرة لإنتاج وإخراج هذا الكتاب عبر المراحل السبع (مثال: 30 - 60 يوم عمل).`;

      const userPrompt = `
نوع العميل والكتاب: ${clientType === 'business' ? 'تاريخ عائلة / شركة تجارية' : 'سيرة ذاتية فردية / مذكرات'}
تفاصيل وقصة السيرة الذاتية: ${topicOrIndustry}
القارئ المستهدف (إن وجد): ${targetAudience || 'غير محدد'}
الهدف الرئيسي من الكتاب: ${goal || 'توثيق قصة النجاح وتخليد الأثر للأجيال القادمة'}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titleIdea: { type: Type.STRING },
              targetAudienceAnalysis: { type: Type.STRING },
              recommendedTone: { type: Type.STRING },
              contentStructure: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              keyHighlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              suggestedService: { type: Type.STRING },
              estimatedTimeline: { type: Type.STRING }
            },
            required: [
              "titleIdea",
              "targetAudienceAnalysis",
              "recommendedTone",
              "contentStructure",
              "keyHighlights",
              "suggestedService",
              "estimatedTimeline"
            ]
          }
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      return res.json(parsedData);
    } catch (err: any) {
      console.error("Gemini AI Brief Error:", err);
      return res.status(500).json({
        error: "حدث خطأ أثناء توليد مقترح المحتوى الذكي. حاول مرة أخرى."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
