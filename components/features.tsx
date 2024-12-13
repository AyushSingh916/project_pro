import { Card, CardContent } from "./ui/card";
import { Layout, Calendar, BarChart } from "lucide-react";

const features = [
  {
    title: "Efficient Sprint Planning",
    description:
      "Plan, organize, and track sprints to ensure smooth project delivery and meet deadlines effectively.",
    icon: Calendar,
  },
  {
    title: "Seamless Issue Assignment",
    description:
      "Assign and manage tasks effortlessly, ensuring that team members are always on track with the right work.",
    icon: Layout,
  },
  {
    title: "Real-Time Project Analytics",
    description:
      "Monitor project progress with detailed insights and analytics to stay ahead and make data-driven decisions.",
    icon: BarChart,
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-20 px-5">
      <div className="container mx-auto">
        <h3 className="text-4xl font-extrabold text-white text-center mb-12">Core Features</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl">
              <CardContent className="pt-6">
                <feature.icon className="h-14 w-14 mb-4 text-blue-400" />
                <h4 className="text-2xl font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
