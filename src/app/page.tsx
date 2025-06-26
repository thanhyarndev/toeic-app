import Link from "next/link";
import { 
  AcademicCapIcon, 
  PencilSquareIcon, 
  ArrowsRightLeftIcon, 
  SpeakerWaveIcon,
  RectangleStackIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const studyModes = [
    {
      id: "multiple-choice",
      title: "Trắc nghiệm",
      description: "Chọn đáp án đúng từ các lựa chọn được đưa ra",
      icon: <AcademicCapIcon className="w-16 h-16" />,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/multiple-choice"
    },
    {
      id: "fill-blank",
      title: "Điền từ",
      description: "Nhập từ tiếng Anh dựa trên gợi ý tiếng Việt",
      icon: <PencilSquareIcon className="w-16 h-16" />,
      color: "bg-green-500 hover:bg-green-600",
      href: "/fill-blank"
    },
    {
      id: "sentence-reorder",
      title: "Sắp xếp câu",
      description: "Kéo thả để sắp xếp các từ thành câu hoàn chỉnh",
      icon: <ArrowsRightLeftIcon className="w-16 h-16" />,
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/sentence-reorder"
    },
    {
      id: "listening",
      title: "Luyện nghe",
      description: "Luyện nghe và chọn từ vựng chính xác",
      icon: <SpeakerWaveIcon className="w-16 h-16" />,
      color: "bg-orange-500 hover:bg-orange-600",
      href: "/listening"
    },
    {
      id: "flashcard",
      title: "Flashcard",
      description: "Học từ vựng với thẻ lật và spaced repetition",
      icon: <RectangleStackIcon className="w-16 h-16" />,
      color: "bg-indigo-500 hover:bg-indigo-600",
      href: "/flashcard"
    },
    {
      id: "word-association",
      title: "Word Association",
      description: "Tìm từ đồng nghĩa và trái nghĩa để mở rộng vốn từ",
      icon: <LinkIcon className="w-16 h-16" />,
      color: "bg-teal-500 hover:bg-teal-600",
      href: "/word-association"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            TOEIC Vocabulary
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chọn một chế độ để bắt đầu hành trình chinh phục từ vựng của bạn.
          </p>
        </div>

        {/* Study Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {studyModes.map((mode) => (
            <Link
              key={mode.id}
              href={mode.href}
              className="group block"
            >
              <div className={`
                relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 
                transform group-hover:scale-105 group-hover:shadow-xl
                ${mode.color} text-white
              `}>
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                
                {/* Card Content */}
                <div className="relative p-8 h-full flex flex-col items-center">
                  {/* Icon */}
                  <div className="mb-4 text-center">
                    {mode.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-center">
                    {mode.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-white/90 text-center leading-relaxed flex-grow">
                    {mode.description}
                  </p>
                  
                  {/* Arrow Indicator */}
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500 dark:text-gray-400">
            Học tập hiệu quả, chinh phục điểm cao!
          </p>
        </div>
      </div>
    </div>
  );
}
