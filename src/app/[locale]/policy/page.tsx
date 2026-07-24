import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Personal data processing policy" : "Политика обработки персональных данных",
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const sections = isEn
    ? [
        {
          title: "1. General",
          text: "This policy describes how Shanghai Pinnacle Technology Co., Ltd. (Aura Robotics) processes personal data submitted through forms on this website.",
        },
        {
          title: "2. What we collect",
          text: "Only what you enter into a form: name, phone number, email address, company name, and the text of your request. Hidden technical fields (page address, interface language, UTM tags) are attached to route your request correctly.",
        },
        {
          title: "3. Why we process it",
          text: "To respond to your request: prepare a quote, register you for a trip, or answer a question. We do not use the data for anything beyond handling your request and the communication that follows from it.",
        },
        {
          title: "4. Storage and transfer",
          text: "Requests are delivered to the company's email and processing systems. We do not sell or hand over your data to third parties, except where required to fulfil your request (for example, arranging a factory visit in your name).",
        },
        {
          title: "5. Your rights",
          text: "You can ask us to update or delete your data at any time — write to inquairy@aura-robotics.ru or message @ostapdotcenko on Telegram.",
        },
      ]
    : [
        {
          title: "1. Общие положения",
          text: "Настоящая политика описывает, как Shanghai Pinnacle Technology Co., Ltd. (Aura Robotics) обрабатывает персональные данные, передаваемые через формы на этом сайте.",
        },
        {
          title: "2. Какие данные мы собираем",
          text: "Только то, что вы вводите в форму: имя, номер телефона, адрес почты, название компании и текст обращения. Скрытые технические поля (адрес страницы, язык интерфейса, UTM-метки) прикладываются, чтобы корректно маршрутизировать заявку.",
        },
        {
          title: "3. Зачем мы их обрабатываем",
          text: "Чтобы ответить на ваше обращение: подготовить расчёт, зарегистрировать на поездку или ответить на вопрос. Данные не используются ни для чего, кроме обработки вашей заявки и последующей связи по ней.",
        },
        {
          title: "4. Хранение и передача",
          text: "Заявки поступают на почту и в системы обработки компании. Мы не продаём и не передаём ваши данные третьим лицам, кроме случаев, когда это нужно для выполнения вашей заявки (например, оформление визита на завод на ваше имя).",
        },
        {
          title: "5. Ваши права",
          text: "Вы можете в любой момент попросить обновить или удалить ваши данные — напишите на inquairy@aura-robotics.ru или в Telegram @ostapdotcenko.",
        },
      ];

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-10">
      <h1 className="text-heading-lg">
        {isEn ? "Personal data processing policy" : "Политика обработки персональных данных"}
      </h1>
      <div className="mt-8 flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-heading-sm">{section.title}</h2>
            <p className="mt-2 text-body text-stone">{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
