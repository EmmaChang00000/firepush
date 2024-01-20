export async function onRequest(context) {
    const resp = await reverseProxy(context);
    return new Response(resp.body, resp);
}

async function reverseProxy(context) {
    return fetch(
        `https://firepush-api.emmatest.online/api/${context.params.proxy.join('/')}`,
        {
            method: context.request.method,
            headers: context.request.headers,
            body: context.request.body,
        }
    )
}