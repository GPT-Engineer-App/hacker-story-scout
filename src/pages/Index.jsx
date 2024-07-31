import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fetchTopStories = async () => {
  const response = await fetch(
    'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100'
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const StoryItem = ({ story }) => (
  <div className="bg-[#1a1a1a] p-4 rounded-md mb-4 border border-[#333] hover:border-[#666] transition-colors">
    <h2 className="text-xl font-semibold text-[#00ff00] mb-2">{story.title}</h2>
    <div className="flex justify-between items-center text-[#888]">
      <span>Upvotes: {story.points}</span>
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00ff00] hover:underline"
      >
        Read more
      </a>
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="bg-[#1a1a1a] p-4 rounded-md mb-4 border border-[#333]">
        <div className="h-6 bg-[#333] rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-[#333] rounded w-1/4"></div>
      </div>
    ))}
  </div>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-[#00ff00] p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Hacker News Top 100</h1>
      <div className="max-w-3xl mx-auto">
        <div className="flex mb-6">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow mr-2 bg-[#1a1a1a] text-[#00ff00] border-[#333]"
          />
          <Button className="bg-[#00ff00] text-black hover:bg-[#00cc00]">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : (
          filteredStories?.map(story => <StoryItem key={story.objectID} story={story} />)
        )}
      </div>
    </div>
  );
};

export default Index;
