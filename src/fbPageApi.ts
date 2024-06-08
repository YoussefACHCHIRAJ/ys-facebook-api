import axios from "axios";
import { ITextPostFbPayload } from "./types/PageApi.types";
import { PageInsightsDatePreset, PageInsightsPeriod } from "./enums";

const fbRequest = axios.create({
  baseURL: "https://graph.facebook.com/",
});

export class FbPageApi {
  private appVersion: string;
  private appId: string;
  private appSecret: string;
  constructor(app_api_version: string, app_id: string, app_secret: string) {
    this.appVersion = app_api_version;
    this.appId = app_id;
    this.appSecret = app_secret;
  }

  async facebookExchangeToken(shortAccessToken: string) {
    try {
      const { data } = await fbRequest.get(
        `${this.appVersion}/oauth/access_token`,
        {
          params: {
            grant_type: "fb_exchange_token",
            client_id: this.appId,
            client_secret: this.appSecret,
            fb_exchange_token: shortAccessToken,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(
        "Uh oh!, failed exchange short access token, details error: " + error
      );
    }
  }

  async facebookUserInfoApi(
    accessToken: string,
    fields: string = "name,picture"
  ) {
    try {
      const { data } = await fbRequest.get("me", {
        params: { access_token: accessToken, fields },
      });
      return data;
    } catch (error) {
      throw new Error("Uh oh!, failed get user info, details error: " + error);
    }
  }

  async facebookShareTextPostToPage(
    pageAccessToken: string,
    payload: ITextPostFbPayload,
    pageId: string
  ) {
    try {
      const { data } = await fbRequest.post(
        `${this.appVersion}/${pageId}/feed`,
        payload,
        {
          params: { access_token: pageAccessToken },
        }
      );
      return data;
    } catch (error) {
      throw new Error("Uh oh!, failed to share text post, details error: " + error);
    }
  }

  async facebookAccountPages(
    access_token: string,
    fields: string = "picture, category_list,category, tasks, name, access_token"
  ) {
    try {
      const { data } = await fbRequest.get(`${this.appVersion}/me/accounts`, {
        params: {
          access_token,
          fields,
        },
      });
      return data;
    } catch (error) {
      throw new Error("Uh oh!, failed get pages infos, details error: " + error);
    }
  }

  async facebookPagePostsReactions(
    pageId: string,
    pageAccessToken: string,
    date_preset: PageInsightsDatePreset = PageInsightsDatePreset.this_year,
    period: PageInsightsPeriod = PageInsightsPeriod.week,
    metric: string = "page_actions_post_reactions_like_total, page_actions_post_reactions_love_total, page_actions_post_reactions_wow_total"
  ) {
    try {
      const { data } = await fbRequest.get(`${pageId}/insights`, {
        params: {
          access_token: pageAccessToken,
          metric,
          date_preset,
          period,
        },
      });

      return data;
    } catch (error) {
      throw new Error(
        "Uh oh!, failed get page post's reactions, details error: " + error
      );
    }
  }

  async facebookPagePosts(
    pageId: string,
    pageAccessToken: string,
    fields: string = "full_picture,message,permalink_url,created_time,likes.summary(true),comments.summary(true),shares"
  ) {
    try {
      const { data } = await fbRequest.get(
        `${this.appVersion}/${pageId}/feed`,
        {
          params: {
            access_token: pageAccessToken,
            fields,
          },
        }
      );

      return data;
    } catch (error) {
      throw new Error("Uh oh!, failed get page's posts, details error: " + error);
    }
  }

  async facebookPageScheduledPosts(
    pageId: string,
    pageAccessToken: string,
    fields: string = "full_picture,message,permalink_url,created_time, likes.summary(true),comments.summary(true),shares"
  ) {
    try {
      const { data } = await fbRequest.get(
        `${this.appVersion}/${pageId}/scheduled_posts`,
        {
          params: {
            access_token: pageAccessToken,
            fields,
          },
        }
      );

      return data;
    } catch (error) {
      throw new Error(
        "Uh oh!, failed get page's scheduled posts, details error: " + error
      );
    }
  }

  async facebookPageLikes(pageId: string, pageAccessToken: string) {
    try {
      const {
        data: { fan_count },
      } = await fbRequest.get(`${pageId}`, {
        params: {
          access_token: pageAccessToken,
          fields: "fan_count",
        },
      });
      return fan_count;
    } catch (error) {
      throw new Error("Uh oh!, failed get page likes count, details error: " + error);
    }
  }

  async facebookPageAnalytics(
    pageId: string,
    pageAccessToken: string,
    date_preset: PageInsightsDatePreset = PageInsightsDatePreset.this_year,
    period: PageInsightsPeriod = PageInsightsPeriod.month
  ) {
    try {
      const { data } = await fbRequest.get(
        `${pageId}/insights/page_impressions_unique`,
        {
          params: {
            access_token: pageAccessToken,
            date_preset,
            period,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error("Uh oh!, failed get page's analytics, details error: " + error);
    }
  }

  async facebookPageWeeklyStats(
    pageId: string,
    pageAccessToken: string,
    date_preset: PageInsightsDatePreset = PageInsightsDatePreset.last_week_mon_sun,
    period: PageInsightsPeriod = PageInsightsPeriod.day,
    metric: string = "page_post_engagements,page_impressions,page_daily_follows_unique"
  ) {
    try {
      const { data } = await fbRequest.get(`${pageId}/insights`, {
        params: {
          access_token: pageAccessToken,
          date_preset,
          period,
          metric,
        },
      });
      return data;
    } catch (error) {
      throw new Error(
        "Uh oh!, failed get page's weekly stats, details error: " + error
      );
    }
  }

  async deleteFacebookPagePost(postId: string, pageAccessToken: string) {
    try {
      const { data } = await fbRequest.delete(postId, {
        params: {
          access_token: pageAccessToken,
        },
      });
      return data;
    } catch (error) {
      throw new Error("Uh oh!, failed delete page post, details error: " + error);
    }
  }

  async facebookPagePostComments(
    pagePostId: string,
    pageAccessToken: string,
    fields: string = "from,message"
  ) {
    try {
      const { data } = await fbRequest.get(`${pagePostId}/comments`, {
        params: {
          fields,
          access_token: pageAccessToken,
        },
      });
      return data.data;
    } catch (error) {
      throw new Error(
        "Uh oh!, failed get comments of this post, details error: " + error
      );
    }
  }

  async facebookDeleteComment(commentId: string, pageAccessToken: string) {
    try {
      const { data } = await fbRequest.delete(`${commentId}`, {
        params: {
          access_token: pageAccessToken,
        },
      });
      return data.data;
    } catch (error) {
      throw new Error("Uh oh!, failed delete this comment, details error: " + error);
    }
  }
  async replyOnFacebookComment(
    commentId: string,
    pageAccessToken: string,
    reply: string
  ) {
    try {
      const { data } = await fbRequest.post(
        `${commentId}/comments`,
        { message: reply },
        {
          params: {
            access_token: pageAccessToken,
          },
        }
      );
      return data.data;
    } catch (error) {
      throw new Error(
        "Uh oh!, failed failed to reply on this comment, details error: " + error
      );
    }
  }
}
