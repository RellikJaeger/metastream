import { load } from 'cheerio';
import { buildUrl, isUrl } from 'utils/url';
import { MediaMetadataService, IMediaMetadataResult, MediaThumbnailSize } from 'services/types';
import { nodeFetch } from 'utils/http';
import { Url } from 'url';

export class WebMetadataService extends MediaMetadataService {
  match({ protocol }: Url): boolean {
    return protocol === 'http:' || protocol === 'https:';
  }

  async resolve(url: string): Promise<IMediaMetadataResult> {
    const result = await fetch(url);
    const text = await result.text();
    const $ = load(text);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text();
    // const src = $('meta[property="og:url"]').attr('content') || url;
    const image = $('meta[property="og:image"]').attr('content');

    const meta: IMediaMetadataResult = {
      url,
      title,
      thumbnails: {
        [MediaThumbnailSize.Default]: image
      }
    };

    return meta;
  }
}
