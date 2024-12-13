import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is ProjectPro?",
    answer:
      "ProjectPro is a robust project management platform designed to empower teams with seamless organization, task tracking, and workflow management, boosting overall productivity and efficiency.",
  },
  {
    question: "How does ProjectPro compare to other project management tools?",
    answer:
      "ProjectPro stands out by combining an intuitive interface with powerful features. We prioritize providing a flexible platform that works well with both agile and traditional project management methodologies, making it adaptable for teams of all sizes and industries.",
  },
  {
    question: "Is ProjectPro suitable for small teams?",
    answer:
      "Absolutely! ProjectPro is designed to scale, offering a solution that works just as well for small teams as it does for large organizations. Its simplicity ensures that any team, regardless of size, can hit the ground running without a steep learning curve.",
  },
  {
    question: "What key features does ProjectPro offer?",
    answer:
      "ProjectPro features include Kanban boards, agile sprint planning tools, detailed project analytics, time tracking, customizable workflows, and enhanced team collaboration. These tools integrate seamlessly to optimize your project management experience.",
  },
  {
    question: "Can ProjectPro handle multiple projects simultaneously?",
    answer:
      "Yes, ProjectPro is designed to manage multiple projects concurrently. You can easily switch between projects, view progress, and track all tasks from one central platform, making it perfect for organizations managing diverse projects or clients.",
  },
  {
    question: "Is there a learning curve for new users?",
    answer:
      "While ProjectPro offers extensive functionality, we've focused on making the platform intuitive and user-friendly. With an easy onboarding process and comprehensive documentation, new users can quickly get up to speed.",
  },
];

const FAQ = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-black py-20 px-5">
      <div className="container mx-auto">
        <h3 className="text-4xl font-extrabold text-white text-center mb-12">
          Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-700"
            >
              <AccordionTrigger className="text-xl font-semibold text-white py-4 px-6 hover:bg-gray-700 transition-all duration-300 ease-in-out">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 py-4 px-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
