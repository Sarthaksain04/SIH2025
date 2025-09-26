// import 'package:flutter/material.dart';
// import 'package:roomchat/Search.dart';
// import 'package:roomchat/Communities.dart';
// import 'package:roomchat/YourCommunities.dart'; // Import YourCommunities page

// class Home extends StatelessWidget {
//   const Home({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Home Page'),
//         backgroundColor: Colors.blue,
//         actions: [
//           IconButton(
//             icon: const Icon(Icons.search, color: Colors.white),
//             onPressed: () {
//               Navigator.push(
//                 context,
//                 MaterialPageRoute(builder: (context) => const Search()),
//               );
//             },
//           ),
//         ],
//       ),
//       body: GestureDetector(
//         onHorizontalDragEnd: (details) {
//           if (details.primaryVelocity != null && details.primaryVelocity! > 0) {
//             // Right swipe
//             Navigator.push(
//               context,
//               MaterialPageRoute(builder: (context) => const YourCommunities()),
//             );
//           }
//         },
//         child: const Center(
//           child: Text(
//             'Welcome to Home Page',
//             style: TextStyle(fontSize: 24),
//           ),
//         ),
//       ),
//       floatingActionButton: FloatingActionButton(
//         onPressed: () {
//           Navigator.push(
//             context,
//             MaterialPageRoute(builder: (context) => const Communities()),
//           );
//         },
//         backgroundColor: Colors.blue,
//         child: const Icon(Icons.add, color: Colors.white),
//       ),
//       floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:roomchat/Search.dart';
import 'package:roomchat/Communities.dart';
import 'package:roomchat/YourCommunities.dart';
import 'package:roomchat/GrievanceDashboard.dart'; 


class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const GrievanceDashboard()),
            );
          },
          child: const Padding(
            padding: EdgeInsets.all(8.0),
            child: CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.dashboard, color: Colors.blue),
            ),
          ),
        ),
        title: const Text('Posts'),
        backgroundColor: Colors.blue,
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Colors.white),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const Search()),
              );
            },
          ),
        ],
      ),
      body: GestureDetector(
        onHorizontalDragEnd: (details) {
          if (details.primaryVelocity != null && details.primaryVelocity! > 0) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const YourCommunities()),
            );
          }
        },
        child: ListView(
          children: const [
            PostBox(
              imagePath: 'lib/Images/PublicWork.png',
              description: 'Pothole near main street causing traffic problems.',
              category: 'Pothole',
              priority: 'Critical',
              location: 'Main Street, City Center',
            ),
            PostBox(
              imagePath: 'lib/Images/Sanitation.png',
              description: 'Trash overflowing near residential area.',
              category: 'Sanitation',
              priority: 'High',
              location: 'Maple Street, Downtown',
            ),
            PostBox(
              imagePath: 'lib/Images/uitility.png',
              description: 'Street light not working for past 3 days.',
              category: 'Street Light',
              priority: 'Medium',
              location: 'Oak Avenue, Suburb',
            ),
            PostBox(
              imagePath: 'lib/Images/Sanitation.png',
              description: 'Illegal waste dumping observed in park.',
              category: 'Waste',
              priority: 'Low',
              location: 'River Park, West Zone',
            ),
            PostBox(
              imagePath: 'lib/Images/PublicWork.png',
              description: 'Drain blockage causing water logging in rainy season.',
              category: 'Sanitation',
              priority: 'High',
              location: 'Pine Street, Near School',
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const Communities()),
          );
        },
        backgroundColor: Colors.blue,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}

class PostBox extends StatefulWidget {
  final String imagePath;
  final String description;
  final String category;
  final String priority;
  final String location;

  const PostBox({
    Key? key,
    required this.imagePath,
    required this.description,
    required this.category,
    required this.priority,
    required this.location,
  }) : super(key: key);

  @override
  _PostBoxState createState() => _PostBoxState();
}

class _PostBoxState extends State<PostBox> {
  int votes = 0;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Image.asset(
            widget.imagePath,
            height: 200,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
          const SizedBox(height: 8),
          Text(
            widget.description,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text(
                'Category: ${widget.category}',
                style: const TextStyle(fontSize: 14),
              ),
              const Spacer(),
              Text(
                'Priority: ${widget.priority}',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Location: ${widget.location}',
            style: const TextStyle(fontSize: 14, color: Colors.grey),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.thumb_up),
                onPressed: () {
                  setState(() {
                    votes++;
                  });
                },
              ),
              Text('$votes votes'),
            ],
          )
        ],
      ),
    );
  }
}
