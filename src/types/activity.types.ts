// 사용자 활동 타입 정의

export enum ActivityType {
  POST = 'post',           // 게시글 작성
  COMMENT = 'comment',     // 댓글 작성
  REACTION = 'reaction',   // 반응 (좋아요/도움이되요/공감 통합)
  VIEW = 'view',          // 조회
  CONSULTATION = 'consultation', // 상담
  DOWNLOAD = 'download',   // 다운로드
  SHARE = 'share'         // 공유
}

export enum ReactionType {
  LIKE = 'like',          // 좋아요
  HELPFUL = 'helpful',    // 도움이 되요
  EMPATHY = 'empathy'     // 공감
}

export enum ContentType {
  POLICY_NEWS = 'policy_news',       // 정책소식
  POLICY_ANALYSIS = 'policy_analysis', // 정책분석
  BUSINESS_VOICE = 'business_voice',  // 비즈니스보이스
  TTONTOK = 'ttontok',               // 똔톡
  NARADDON_TUBE = 'naraddon_tube',   // 나라똔튜브
  EXPERT_CONSULTATION = 'expert_consultation' // 전문가 상담
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  contentType: ContentType;
  contentId: string;
  contentTitle?: string;

  // 활동별 세부 정보
  details?: {
    reactionType?: ReactionType;  // 반응 타입
    comment?: string;             // 댓글 내용
    postTitle?: string;           // 게시글 제목
    postContent?: string;         // 게시글 내용
    downloadFile?: string;        // 다운로드 파일명
    shareMethod?: string;         // 공유 방법
  };

  // 메타데이터
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

// 사용자 통계
export interface UserStats {
  totalPosts: number;        // 총 게시글 수
  totalComments: number;     // 총 댓글 수
  totalReactions: number;    // 총 반응 수
  totalViews: number;        // 총 조회수

  // 반응별 통계
  reactions: {
    likes: number;
    helpfuls: number;
    empathies: number;
  };

  // 콘텐츠별 활동
  contentStats: {
    [key in ContentType]?: {
      posts: number;
      comments: number;
      reactions: number;
      views: number;
    };
  };

  // 기간별 활동
  activityByPeriod: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };

  // 활동 점수
  activityScore: number;
  level: number;
  nextLevelProgress: number;
}

// 활동 집계
export interface ActivitySummary {
  date: Date;
  activities: {
    type: ActivityType;
    count: number;
  }[];
  totalScore: number;
}