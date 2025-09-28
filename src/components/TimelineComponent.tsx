"use client";

interface TimelineEvent {
  id: string | number;
  stage: string;
  actor: string;
  location: string;
  timestamp: string | null;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'gray';
  description?: string;
  badge?: string;
}

export default function TimelineComponent({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, idx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {idx !== events.length - 1 ? (
                <span className="absolute top-8 left-8 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className={`relative flex space-x-3 ${idx % 2 === 1 ? 'bg-gray-50 rounded-lg p-3' : ''}`}>
                <div>
                  <span
                    className={`h-16 w-16 rounded-full flex items-center justify-center ring-8 ring-white text-2xl ${
                      event.color === 'green' ? 'bg-green-500' :
                      event.color === 'blue' ? 'bg-blue-500' :
                      event.color === 'purple' ? 'bg-purple-500' :
                      event.color === 'orange' ? 'bg-orange-500' :
                      event.color === 'red' ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    •
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{event.stage}</h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{event.actor}</span> at {event.location}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Pending'}
                    </div>
                  </div>
                  {event.description && <p className="mt-1 text-sm text-gray-700">{event.description}</p>}
                  <div className="mt-3 flex items-center space-x-2">
                    {event.badge && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {event.badge.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
