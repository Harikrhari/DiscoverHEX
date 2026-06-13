import axios from 'axios';

const META_ACCESS_TOKEN = import.meta.env.VITE_SOCIAL_META_ACCESS_TOKEN;
const FACEBOOK_PAGE_ID = import.meta.env.VITE_FACEBOOK_PAGE_ID;
const INSTAGRAM_ACCOUNT_ID = import.meta.env.VITE_INSTAGRAM_ACCOUNT_ID;
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const GRAPH_API = 'https://graph.facebook.com/v19.0';

/**
 * Generate an engaging product caption with hashtags.
 * @param {Object} product
 * @returns {string}
 */
export function generateCaption(product) {
  const charityLine = `5% of every purchase goes to charity — real impact with every order. 💚`;
  const hashtags = [
    '#DiscoverHEX',
    '#HumanExcellence',
    `#${product.category?.replace(/\s+/g, '') || 'NewDrop'}`,
    '#ShopForGood',
    '#MarketplaceWithPurpose',
    '#HEXNation',
    product.tags?.map((t) => `#${t}`).join(' ') || '',
  ]
    .filter(Boolean)
    .join(' ');

  return `✨ NEW DROP: ${product.name}\n\n${product.shortDescription || product.description?.slice(0, 120) || ''}\n\n💰 Only $${product.price?.toFixed(2)}\n${charityLine}\n\n🔗 Shop now: discoverhex.com/product/${product.id}\n\n${hashtags}`;
}

/**
 * Post a product to Instagram via the Graph API (requires Facebook-connected IG business account).
 * @param {Object} product
 * @param {string} imageUrl - Public URL of the product image
 * @param {string} [caption] - Optional override caption
 * @returns {Promise<Object>}
 */
export async function postToInstagram(product, imageUrl, caption) {
  const finalCaption = caption || generateCaption(product);

  try {
    // Step 1: Create media container
    const containerRes = await axios.post(
      `${GRAPH_API}/${INSTAGRAM_ACCOUNT_ID}/media`,
      {
        image_url: imageUrl,
        caption: finalCaption,
        access_token: META_ACCESS_TOKEN,
      }
    );

    const creationId = containerRes.data.id;

    // Step 2: Publish container
    const publishRes = await axios.post(
      `${GRAPH_API}/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        creation_id: creationId,
        access_token: META_ACCESS_TOKEN,
      }
    );

    return {
      success: true,
      platform: 'instagram',
      postId: publishRes.data.id,
      message: 'Posted to Instagram successfully',
    };
  } catch (error) {
    console.error('Instagram post failed:', error.response?.data || error.message);
    return {
      success: false,
      platform: 'instagram',
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Post a product to a Facebook Page.
 * @param {Object} product
 * @param {string} imageUrl
 * @param {string} [caption]
 * @returns {Promise<Object>}
 */
export async function postToFacebook(product, imageUrl, caption) {
  const finalCaption = caption || generateCaption(product);

  try {
    const response = await axios.post(`${GRAPH_API}/${FACEBOOK_PAGE_ID}/photos`, {
      url: imageUrl,
      message: finalCaption,
      access_token: META_ACCESS_TOKEN,
    });

    return {
      success: true,
      platform: 'facebook',
      postId: response.data.id,
      message: 'Posted to Facebook Page successfully',
    };
  } catch (error) {
    console.error('Facebook post failed:', error.response?.data || error.message);
    return {
      success: false,
      platform: 'facebook',
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Post a product video to YouTube via backend proxy (OAuth required server-side).
 * @param {Object} product
 * @param {string} videoUrl - Public URL or backend path to the video
 * @param {string} [title]
 * @param {string} [description]
 * @returns {Promise<Object>}
 */
export async function postToYouTube(product, videoUrl, title, description) {
  const finalTitle = title || `${product.name} — Available on DiscoverHEX`;
  const finalDescription =
    description ||
    `${product.description || ''}\n\nShop now: https://discoverhex.com/product/${product.id}\n\n${generateCaption(product)}`;

  try {
    const response = await axios.post(`${API_BASE}/social/youtube/upload`, {
      video_url: videoUrl,
      title: finalTitle,
      description: finalDescription,
      tags: ['DiscoverHEX', 'HumanExcellence', product.category || 'shopping'],
      category_id: '26', // Howto & Style
      privacy_status: 'public',
    });

    return {
      success: true,
      platform: 'youtube',
      videoId: response.data.video_id,
      message: 'Uploaded to YouTube successfully',
    };
  } catch (error) {
    console.error('YouTube upload failed:', error.response?.data || error.message);
    return {
      success: false,
      platform: 'youtube',
      error: error.response?.data?.message || error.message,
    };
  }
}

/**
 * Post to all platforms at once.
 * @param {Object} product
 * @param {string} imageUrl
 * @param {string} [videoUrl]
 * @returns {Promise<Object[]>}
 */
export async function postToAllPlatforms(product, imageUrl, videoUrl) {
  const tasks = [
    postToInstagram(product, imageUrl),
    postToFacebook(product, imageUrl),
  ];
  if (videoUrl) tasks.push(postToYouTube(product, videoUrl));

  const results = await Promise.allSettled(tasks);
  return results.map((r) => (r.status === 'fulfilled' ? r.value : { success: false, error: r.reason }));
}
