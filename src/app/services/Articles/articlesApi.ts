
export const fetchArticles = async () => {

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/get_all_post/v1/get_all_post`
    );
    return await response.json() || [];
};