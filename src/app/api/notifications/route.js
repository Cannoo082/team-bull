import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (userId === null) {
    return Response.json({ message: "Provide a user id" }, { status: 400 });
  }

  const sql = ` 
    SELECT 
        n.*, 
        un.UserNotificationID, 
        un.IsRead 
    FROM user_notification un, notification n 
    WHERE un.NotificationID=n.NotificationID AND un.UserID=?
  `; 
  const params=[userId]; 
  const notifications = await execute(sql, params); 
  if (notifications===undefined) {
    return Response.json({message: "Failed to load notifications"}, {status: 500}); 
  } 

  return Response.json(notifications); 
} 
