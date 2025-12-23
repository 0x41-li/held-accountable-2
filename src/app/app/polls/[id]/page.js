"use client";
import PollDetail from "@/components/PollDetail";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PollDetailPage({ data }) {
  const params = useParams();
  const [id, setId] = useState(null);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPoll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pollId = params?.id || data?.id;
      if (!pollId) {
        setError('Poll ID is required');
        return;
      }

      const response = await fetch(`/api/company-polls?id=${pollId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch poll');
      }

      const result = await response.json();
      const apiPoll = result.poll;

      if (!apiPoll) {
        setError('Poll not found');
        return;
      }

      // Transform API poll data to match expected format
      let sectionIds = [];
      let sectionTitles = [];
      
      try {
        if (apiPoll.section_ids) {
          sectionIds = typeof apiPoll.section_ids === 'string' 
            ? JSON.parse(apiPoll.section_ids) 
            : apiPoll.section_ids;
        }
        if (apiPoll.section_titles) {
          sectionTitles = typeof apiPoll.section_titles === 'string'
            ? JSON.parse(apiPoll.section_titles)
            : apiPoll.section_titles;
        }
      } catch (e) {
        console.warn('Error parsing section data:', e);
      }

      // Convert createdAt string to Date
      const createdAt = apiPoll.created_at ? new Date(apiPoll.created_at) : new Date();
      
      const transformedPoll = {
        id: apiPoll.id.toString(),
        title: apiPoll.title || '',
        content: apiPoll.content || '',
        category: apiPoll.category || '',
        topic: apiPoll.category || '',
        company_id: apiPoll.company_id || null,
        url: apiPoll.url || '',
        image_url: apiPoll.image_url || '',
        status: apiPoll.status || 0,
        vote_result: apiPoll.vote_result || 0,
        comment_count: apiPoll.comment_count || 0,
        sections_ids: sectionIds,
        sections_titles: sectionTitles,
        section_ids: apiPoll.section_ids,
        section_titles: apiPoll.section_titles,
        createdAt: {
          seconds: Math.floor(createdAt.getTime() / 1000),
          nanoseconds: (createdAt.getTime() % 1000) * 1000000
        },
        created_at: apiPoll.created_at,
        updated_at: apiPoll.updated_at,
        // Default values for fields that PollDetail component might expect
        questions: apiPoll.questions || [{
          headline: apiPoll.title || '',
          summary: apiPoll.content?.replace(/<[^>]*>?/g, '').replace(/\*/g, "").replace(/#/g, "").substring(0, 200) || '',
        }],
        like_users: apiPoll.like_users || [],
        dislike_users: apiPoll.dislike_users || [],
        likes: apiPoll.likes || 0,
        dislikes: apiPoll.dislikes || 0,
        user: {
          id: '',
          fullname: '',
          username: '',
          avatar: ''
        }
      };

      setPoll(transformedPoll);
    } catch (err) {
      console.error('Error loading poll:', err);
      setError(err.message || 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    } else if (data?.id) {
      setId(data.id);
    }
  }, [params, data]);

  useEffect(() => {
    if (id) {
      loadPoll();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-[#3B88E3] text-lg">Loading poll...</div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500 text-lg">{error || 'Poll not found'}</div>
      </div>
    );
  }

  return (
    <PollDetail
      poll={poll}
      back={data?.back}
    />
  );
}

