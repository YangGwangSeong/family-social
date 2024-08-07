export interface CommentFormProps {
	onCommentRefetch: () => void;
	feedId: string;
	feedWriterId: string;
	parentId?: string;
	replyId?: string;
	commentId?: string;
	isEdit?: boolean;
	commentContents?: string;
	handleCloseReply?: () => void;
	handleEditComment?: () => void;
}

export interface CreateMentionRequest {
	mentionMemberId: string;
	mentionPosition: number;
}
