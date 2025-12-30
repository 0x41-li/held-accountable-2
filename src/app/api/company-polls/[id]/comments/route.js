import { NextResponse } from 'next/server';
import { companyPollCommentService, companyPollService, notificationService } from '@/services/database/companyService';

// GET /api/company-polls/[id]/comments - Get all comments for a poll
export async function GET(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get('comment_id');
        const parentId = searchParams.get('parent_id');
        const includeReplies = searchParams.get('include_replies') !== 'false';

        if (commentId) {
            // Get single comment by ID
            const comment = await companyPollCommentService.getById(parseInt(commentId));
            if (!comment || comment.poll_id !== pollId) {
                return NextResponse.json(
                    { error: 'Comment not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ comment }, { status: 200 });
        }

        if (parentId) {
            // Get replies to a specific comment
            const replies = await companyPollCommentService.getReplies(parseInt(parentId));
            return NextResponse.json({ comments: replies }, { status: 200 });
        }

        // Get all comments for this poll
        const comments = await companyPollCommentService.getByPollId(pollId, includeReplies);
        return NextResponse.json({ comments }, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/company-polls/[id]/comments:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/company-polls/[id]/comments - Create a new comment
export async function POST(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const body = await req.json();
        const { user_id, user_name, user_logo, parent_id, content } = body;

        if (!user_id || !content) {
            return NextResponse.json(
                { error: 'user_id and content are required' },
                { status: 400 }
            );
        }

        const comment = await companyPollCommentService.create({
            poll_id: pollId,
            user_id,
            user_name,
            user_logo,
            parent_id: parent_id ? parseInt(parent_id) : null,
            content
        });

        // Create notifications only for comment replies
        if (parent_id) {
            try {
                const poll = await companyPollService.getById(pollId);
                if (poll) {
                    // This is a reply - notify the parent comment author
                    const parentComment = await companyPollCommentService.getById(parseInt(parent_id));
                    if (parentComment && parentComment.user_id !== user_id) {
                        // Don't notify if replying to own comment
                        await notificationService.create({
                            user_id: parentComment.user_id,
                            type: 'comment_reply',
                            title: `${user_name || 'Someone'} replied to your comment`,
                            content: `${user_name || 'Someone'} replied to your comment on "${poll.title}": "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
                            poll_id: pollId,
                            points: null
                        });
                    }
                }
            } catch (notifError) {
                console.error('Error creating comment reply notification:', notifError);
                // Don't fail the comment creation if notification fails
            }
        }

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/company-polls/[id]/comments:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/company-polls/[id]/comments - Update a comment
export async function PUT(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const body = await req.json();
        const { comment_id, content } = body;

        if (!comment_id) {
            return NextResponse.json(
                { error: 'comment_id is required' },
                { status: 400 }
            );
        }

        if (!content) {
            return NextResponse.json(
                { error: 'content is required' },
                { status: 400 }
            );
        }

        // Verify comment belongs to this poll
        const existingComment = await companyPollCommentService.getById(comment_id);
        if (!existingComment || existingComment.poll_id !== pollId) {
            return NextResponse.json(
                { error: 'Comment not found for this poll' },
                { status: 404 }
            );
        }

        const updatedComment = await companyPollCommentService.update(comment_id, { content });
        return NextResponse.json({ comment: updatedComment }, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/company-polls/[id]/comments:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/company-polls/[id]/comments - Delete a comment
export async function DELETE(req, { params }) {
    try {
        const pollId = parseInt(params.id);
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get('comment_id');

        if (!commentId) {
            return NextResponse.json(
                { error: 'comment_id is required' },
                { status: 400 }
            );
        }

        // Verify comment belongs to this poll
        const comment = await companyPollCommentService.getById(parseInt(commentId));
        if (!comment || comment.poll_id !== pollId) {
            return NextResponse.json(
                { error: 'Comment not found for this poll' },
                { status: 404 }
            );
        }

        await companyPollCommentService.delete(parseInt(commentId));
        return NextResponse.json(
            { message: 'Comment deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in DELETE /api/company-polls/[id]/comments:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

