import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'success',
    title: 'Email Classification Complete',
    message: '47 emails categorized automatically',
    time: '2 minutes ago',
    icon: CheckCircle,
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Priority Email',
    message: 'Important email from client requires attention',
    time: '15 minutes ago',
    icon: AlertCircle,
  },
  {
    id: 3,
    type: 'info',
    title: 'Daily Summary Ready',
    message: 'Your daily email summary is now available',
    time: '1 hour ago',
    icon: Clock,
  },
];

export default function RecentAlerts() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${alert.type === 'success' ? 'bg-green-100' : ''}
              ${alert.type === 'warning' ? 'bg-yellow-100' : ''}
              ${alert.type === 'info' ? 'bg-blue-100' : ''}
            `}>
              <alert.icon className={`
                w-4 h-4
                ${alert.type === 'success' ? 'text-green-600' : ''}
                ${alert.type === 'warning' ? 'text-yellow-600' : ''}
                ${alert.type === 'info' ? 'text-blue-600' : ''}
              `} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{alert.title}</p>
              <p className="text-sm text-gray-500">{alert.message}</p>
              <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}