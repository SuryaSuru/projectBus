export class FeedbackModel {
  constructor(
    public userId: string = "",
    public busId: string = "",
    public rating: number = 0,
    public comment: string = "",
    public feedbackDate: Date = new Date()
  ) {}
}

export class FeedbackEntity {
  constructor(
    public id: string | undefined = undefined,
    public userId: string,
    public busId: string,
    public rating: number,
    public comment: string,
    public feedbackDate: Date
  ) {}
}

export class FeedbackMapper {
  static toEntity(feedbackData: any, includeId: boolean = true, existingFeedback?: FeedbackEntity): FeedbackEntity {
    if (existingFeedback != null) {
      return {
        ...existingFeedback,
        userId: feedbackData.userId !== undefined ? feedbackData.userId : existingFeedback.userId,
        busId: feedbackData.busId !== undefined ? feedbackData.busId : existingFeedback.busId,
        rating: feedbackData.rating !== undefined ? feedbackData.rating : existingFeedback.rating,
        comment: feedbackData.comment !== undefined ? feedbackData.comment : existingFeedback.comment,
        feedbackDate: feedbackData.feedbackDate !== undefined ? feedbackData.feedbackDate : existingFeedback.feedbackDate
      };
    } else {
      const feedbackEntity: FeedbackEntity = {
        id: includeId ? (feedbackData._id ? feedbackData._id.toString() : undefined) : feedbackData._id.toString(),
        userId: feedbackData.userId,
        busId: feedbackData.busId,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        feedbackDate: feedbackData.feedbackDate
      };
      return feedbackEntity;
    }
  }

  static toModel(feedback: FeedbackEntity): any {
    return {
      id: feedback.id,
      userId: feedback.userId,
      busId: feedback.busId,
      rating: feedback.rating,
      comment: feedback.comment,
      feedbackDate: feedback.feedbackDate
    };
  }
}
