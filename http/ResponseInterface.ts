export interface ResponseInterface {
  status: number;
  message: string;
  data?: BodyInit;
}

/**
 * Return function for http response
 */
export function ResponseJson(
  requestEvent: Deno.RequestEvent,
  res: ResponseInterface,
) {
  return requestEvent.respondWith(
    new Response(JSON.stringify(res), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}
