import Link from "next/link";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import SurveyResponse from "@/models/SurveyResponse";
import SurveyQuestion from "@/models/SurveyQuestion";

async function getStats() {
  await dbConnect();

  try {
    const [
      totalQuestions,
      totalSubmissions,
      newSubmissions,
      reviewedSubmissions
    ] = await Promise.all([
      SurveyQuestion.countDocuments({}),
      SurveyResponse.countDocuments({}),
      SurveyResponse.countDocuments({ status: 'new' }),
      SurveyResponse.countDocuments({ status: { $in: ['reviewed', 'completed'] } }) // Assuming 'reviewed' or 'completed' meant reviewed
    ]);

    return {
      totalQuestions,
      totalSubmissions,
      newSubmissions,
      reviewedSubmissions,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalQuestions: 0,
      totalSubmissions: 0,
      newSubmissions: 0,
      reviewedSubmissions: 0,
    };
  }
}

async function getActionItems() {
  await dbConnect();
  try {
    const users = await User.find({
      $or: [
        { followUpDate: { $exists: true, $ne: null } },
        { refillReminderDate: { $exists: true, $ne: null } }
      ]
    }).select('firstName lastName email followUpDate refillReminderDate');

    const actions = [];
    const now = new Date();

    users.forEach(user => {
      // Process Follow Up
      if (user.followUpDate) {
        const date = new Date(user.followUpDate);
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Include if overdue or within next 14 days
        if (diffDays <= 14) {
           actions.push({
             type: 'Follow Up',
             user,
             date,
             days: diffDays,
             isOverdue: diffDays < 0,
             id: `${user._id}-followup`
           });
        }
      }

      // Process Refill
      if (user.refillReminderDate) {
        const date = new Date(user.refillReminderDate);
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 14) {
           actions.push({
             type: 'Refill',
             user,
             date,
             days: diffDays,
             isOverdue: diffDays < 0,
             id: `${user._id}-refill`
           });
        }
      }
    });

    // Sort by urgency (most overdue first, then nearest future)
    return actions.sort((a, b) => a.days - b.days);

  } catch (error) {
    console.error("Error fetching action items:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const stats = await getStats();
  const actionItems = await getActionItems();

  const statCards = [
    {
      label: "Total Questions",
      value: stats.totalQuestions,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      ),
      href: "/dashboard/survey",
      color: "bg-blue-500",
    },
    {
      label: "Total Submissions",
      value: stats.totalSubmissions,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
      href: "/dashboard/submissions",
      color: "bg-primary",
    },
    {
      label: "New Submissions",
      value: stats.newSubmissions,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      href: "/dashboard/submissions?status=new",
      color: "bg-green-500",
    },
    {
      label: "Reviewed",
      value: stats.reviewedSubmissions,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      href: "/dashboard/submissions?status=reviewed",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-secondary">Welcome back!</h2>
        <p className="text-gray-600 mt-1">Here's what's happening with your surveys.</p>
      </div>

      {/* Action Center - Notification Hub */}
      {actionItems.length > 0 && (
         <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-4 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-600">
                  <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-orange-900">Action Center ({actionItems.length} Tasks)</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {actionItems.map(item => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.isOverdue ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                {item.days < 0 ? '!' : item.days}d
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{item.user.firstName} {item.user.lastName}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    {item.type === 'Follow Up' ? '🩺 Follow Up' : '💊 Refill'} 
                                    <span>•</span>
                                    <span className={item.isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}>
                                        {item.isOverdue ? `Overdue by ${Math.abs(item.days)} days` : `Due in ${item.days} days`}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <Link 
                            href={`/dashboard/users/${item.user._id}`}
                            className="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                        >
                            View Patient
                        </Link>
                    </div>
                ))}
            </div>
         </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-secondary mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-3 rounded-lg`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/survey"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Question
          </Link>
          <Link
            href="/dashboard/submissions"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            View Submissions
          </Link>
          <Link
            href="/get-started"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Preview Survey
          </Link>
        </div>
      </div>
    </div>
  );
}
