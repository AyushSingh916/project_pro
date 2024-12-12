import { Card, CardContent } from "./ui/card";
import {
    Layout,
    Calendar,
    BarChart,
  } from "lucide-react";

const features = [
    {
      title: "Intuitive Kanban Boards",
      description:
        "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
      icon: Layout,
    },
    {
      title: "Powerful Sprint Planning",
      description:
        "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
      icon: Calendar,
    },
    {
      title: "Comprehensive Reporting",
      description:
        "Gain insights into your team's performance with detailed, customizable reports and analytics.",
      icon: BarChart,
    },
  ];

const Features = () => {
  return (
    <section id="features" className="bg-gray-900 py-20 px-5">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800">
              <CardContent className="pt-6">
                <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
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
