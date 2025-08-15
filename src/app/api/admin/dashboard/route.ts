export const dynamic = "force-static"; // Required for static export

export async function GET() {
  return new Response(
    JSON.stringify({
      success: true,
      message: "Dummy dashboard data for deployment bypass",
      data: {
        statistics: {
          totalContacts: 0,
          totalBetaSignups: 0,
          totalChatSessions: 0
        },
        recentActivity: {
          contacts: [],
          betaSignups: []
        }
      }
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
