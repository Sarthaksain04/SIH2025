import 'package:flutter/material.dart';

class NotificationPage extends StatelessWidget {
  const NotificationPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Extended sample notifications (status updates + admin appreciation)
    final List<Map<String, String>> notifications = [
      {
        "type": "status",
        "title": "Grievance Resolved",
        "message": "Your grievance #CBDOT/E/2024/0051238 has been resolved successfully.",
        "time": "2h ago"
      },
      {
        "type": "status",
        "title": "Grievance In Progress",
        "message": "Your grievance #DEABD/E/2024/0079644 is now under review.",
        "time": "5h ago"
      },
      {
        "type": "appreciation",
        "title": "Admin Appreciation 🎉",
        "message": "Admin has tagged you and awarded a certificate for your active participation!",
        "time": "1d ago"
      },
      {
        "type": "status",
        "title": "New Circular 📢",
        "message": "A new update has been released regarding waste management policies.",
        "time": "2d ago"
      },
      {
        "type": "status",
        "title": "Pending Action Required",
        "message": "Please provide additional documents for grievance #XYZ/E/2024/0034456.",
        "time": "3d ago"
      },
      {
        "type": "appreciation",
        "title": "Certificate of Excellence 🏅",
        "message": "You have been awarded 'Best Contributor' for helping improve the platform.",
        "time": "4d ago"
      },
      {
        "type": "status",
        "title": "Grievance Escalated",
        "message": "Your grievance #PQRS/E/2024/0089123 has been escalated to higher authorities.",
        "time": "5d ago"
      },
      {
        "type": "appreciation",
        "title": "Special Recognition 🌟",
        "message": "Admin has recognized your consistent reporting and tagged you in an appreciation post.",
        "time": "1w ago"
      },
      {
        "type": "status",
        "title": "System Maintenance",
        "message": "Scheduled downtime for maintenance on 22nd Sept, 2:00 AM - 5:00 AM.",
        "time": "1w ago"
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Notifications"),
        backgroundColor: Colors.blue,
      ),
      body: ListView.builder(
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          final notif = notifications[index];
          bool isAppreciation = notif["type"] == "appreciation";

          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 3,
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor:
                    isAppreciation ? Colors.green.shade200 : Colors.orange.shade200,
                child: Icon(
                  isAppreciation ? Icons.emoji_events : Icons.notifications_active,
                  color: isAppreciation ? Colors.green.shade800 : Colors.orange.shade800,
                ),
              ),
              title: Text(
                notif["title"]!,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 4),
                  Text(notif["message"]!),
                  const SizedBox(height: 6),
                  Text(
                    notif["time"]!,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
              trailing: isAppreciation
                  ? const Icon(Icons.star, color: Colors.amber)
                  : const Icon(Icons.circle_notifications, color: Colors.blue),
            ),
          );
        },
      ),
    );
  }
}
