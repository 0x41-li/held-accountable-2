"use client"
import { useState } from 'react';

const Post = ({ post }) => {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState(post.options);

  const handleVote = (index) => {
    if (voted) return;
    setSelectedOption(index);
    const newOptions = [...options];
    newOptions[index].votes += 1;
    setOptions(newOptions);
    setVoted(true);
  };

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">{post.question}</h2>
      <div className="space-y-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleVote(index)}
            className={`w-full text-left p-4 rounded-lg transition-colors ${
              selectedOption === index ? 'bg-blue-100' : 'bg-gray-50'
            }`}
            disabled={voted}
          >
            <div className="flex items-center justify-between">
              <span>{option.text}</span>
              {voted && (
                <span className="text-sm text-gray-500">
                  {((option.votes / totalVotes) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <span>{totalVotes} total votes</span>
        <span className="mx-2">•</span>
        <span>{post.category}</span>
      </div>
    </div>
  );
};

export default Post;