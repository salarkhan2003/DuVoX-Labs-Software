export const dynamic = "force-static"; // Required for static export

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "skipped",
      version: "1.0.0"
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
