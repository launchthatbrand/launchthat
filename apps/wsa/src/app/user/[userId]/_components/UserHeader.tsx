import { FaChartLine, FaLinkedin, FaTwitter } from "react-icons/fa";

import { UserProfile } from "../_data/mock-data";

interface Props {
  profile: UserProfile;
}

export function UserHeader({ profile }: Props) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-md">
      {/* Background Banner */}
      <div className="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600" />

      <div className="relative px-8 pb-8">
        {/* Profile Info Section */}
        <div className="flex items-end gap-8">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="-mt-16 h-32 w-32 rounded-full border-4 border-white shadow-xl"
          />
          <div className="flex flex-1 items-center justify-between pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                <span>📍 {profile.location}</span>
                <span>⌛ {profile.tradingExperience}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                >
                  <FaTwitter size={20} />
                </a>
              )}
              {profile.socialLinks.tradingview && (
                <a
                  href={profile.socialLinks.tradingview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                >
                  <FaChartLine size={20} />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                >
                  <FaLinkedin size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio & Markets */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-gray-600">{profile.bio}</p>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">
              Preferred Markets
            </h3>
            <div className="mt-2 flex gap-2">
              {profile.preferredMarkets.map((market) => (
                <span
                  key={market}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  {market}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4 rounded-lg bg-gray-50 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {profile.stats.lessonsCompleted}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-500">
              Lessons Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {profile.stats.commentsPosted}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-500">
              Comments Posted
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {profile.stats.tradeIdeasShared}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-500">
              Trade Ideas Shared
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {profile.stats.totalLikes}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-500">
              Total Likes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
