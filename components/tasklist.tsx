import Link from 'next/link';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: {
    name: string;
    organization: {
      name: string;
    };
  };
}

interface AssignedTasksListProps {
  issues: Issue[];
}

// Utility function to get status icon and color
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'DONE':
      return { icon: CheckCircle2, color: 'text-green-600' };
    case 'IN_PROGRESS':
      return { icon: Clock, color: 'text-blue-600' };
    case 'TODO':
      return { icon: AlertTriangle, color: 'text-yellow-600' };
    default:
      return { icon: AlertTriangle, color: 'text-gray-600' };
  }
};

// Utility function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'LOW':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AssignedTasksList({ issues }: AssignedTasksListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="divide-y divide-gray-200">
        {issues.map((issue) => {
          const StatusIcon = getStatusIcon(issue.status).icon;
          const statusColor = getStatusIcon(issue.status).color;
          const priorityColor = getPriorityColor(issue.priority);

          return (
            <Link 
              href={`/issues/${issue.id}`} 
              key={issue.id} 
              className="block hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <StatusIcon className={`${statusColor} flex-shrink-0`} size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <span>{issue.project.organization.name}</span>
                      <span>•</span>
                      <span>{issue.project.name}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${priorityColor}`}>
                  {issue.priority}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}