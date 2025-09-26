// import 'package:flutter/material.dart';
// import 'package:image_picker/image_picker.dart';
// import 'dart:io';

// class Communities extends StatefulWidget {
//   const Communities({super.key});

//   @override
//   State<Communities> createState() => _CommunitiesState();
// }

// class _CommunitiesState extends State<Communities> {
//   File? _image;
//   final TextEditingController roomNameController = TextEditingController();
//   final TextEditingController roomDescController = TextEditingController();

//   // Pick image from gallery
//   Future<void> _pickImage() async {
//     final ImagePicker picker = ImagePicker();
//     final XFile? pickedFile = await picker.pickImage(source: ImageSource.gallery);

//     if (pickedFile != null) {
//       setState(() {
//         _image = File(pickedFile.path);
//       });
//     }
//   }

//   @override
//   void dispose() {
//     roomNameController.dispose();
//     roomDescController.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Create Room'),
//         backgroundColor: Colors.blue,
//         automaticallyImplyLeading: false,
//       ),
//       body: SingleChildScrollView(
//         child: Padding(
//           padding: const EdgeInsets.all(20.0),
//           child: Column(
//             children: [
//               const SizedBox(height: 20),

//               // Room Avatar
//               Center(
//                 child: GestureDetector(
//                   onTap: _pickImage,
//                   child: CircleAvatar(
//                     radius: 60,
//                     backgroundColor: Colors.grey[300],
//                     backgroundImage: _image != null ? FileImage(_image!) : null,
//                     child: _image == null
//                         ? const Icon(Icons.add_a_photo, size: 40, color: Colors.white)
//                         : null,
//                   ),
//                 ),
//               ),

//               const SizedBox(height: 30),

//               // Room Name
//               TextField(
//                 controller: roomNameController,
//                 decoration: InputDecoration(
//                   hintText: 'Room Name',
//                   border: OutlineInputBorder(
//                     borderRadius: BorderRadius.circular(12),
//                   ),
//                   contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
//                 ),
//               ),

//               const SizedBox(height: 20),

//               // Room Description (Optional)
//               TextField(
//                 controller: roomDescController,
//                 decoration: InputDecoration(
//                   hintText: 'Room Description (Optional)',
//                   border: OutlineInputBorder(
//                     borderRadius: BorderRadius.circular(12),
//                   ),
//                   contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
//                 ),
//               ),

//               const SizedBox(height: 30),

//               // Create Room Button
//               SizedBox(
//                 width: double.infinity,
//                 height: 50,
//                 child: ElevatedButton(
//                   onPressed: () {
//                     String roomName = roomNameController.text;
//                     String roomDesc = roomDescController.text;
//                     print('Room Name: $roomName');
//                     print('Room Description: $roomDesc');
//                     // Add your logic to create room
//                   },
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: Colors.blue,
//                   ),
//                   child: const Text(
//                     'Create Room',
//                     style: TextStyle(fontSize: 18, color: Colors.white),
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class Communities extends StatefulWidget {
  const Communities({super.key});

  @override
  State<Communities> createState() => _CommunitiesState();
}

class _CommunitiesState extends State<Communities> {
  File? _image;
  String selectedCategory = 'Pothole';
  final TextEditingController locationController = TextEditingController();
  final TextEditingController reporterController = TextEditingController();
  final TextEditingController titleController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();

  String priority = 'Low';
  int currentStep = 0;

  final List<String> categories = [
    'Pothole',
    'Sanitation',
    'Street Light',
    'Waste',
  ];

  final List<String> steps = [
    'Submitted',
    'Assigned',
    'In Progress',
    'Resolved',
    'Closed',
  ];

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? pickedFile =
        await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
        priority = 'Critical';
      });
    }
  }

  @override
  void dispose() {
    locationController.dispose();
    reporterController.dispose();
    titleController.dispose();
    descriptionController.dispose();
    super.dispose();
  }

  Widget buildTimeline() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(steps.length * 2 - 1, (index) {
        if (index.isEven) {
          int stepIndex = index ~/ 2;
          bool isActive = stepIndex <= currentStep;
          return Column(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: isActive ? Colors.green : Colors.grey.shade300,
                child: isActive
                    ? const Icon(Icons.check, color: Colors.white, size: 16)
                    : const SizedBox.shrink(),
              ),
              const SizedBox(height: 6),
              SizedBox(
                width: 70,
                child: Text(
                  steps[stepIndex],
                  style: TextStyle(
                    fontSize: 12,
                    color: isActive ? Colors.green : Colors.grey,
                    fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          );
        } else {
          bool isActive = index ~/ 2 < currentStep;
          return Expanded(
            child: Container(
              height: 2,
              color: isActive ? Colors.green : Colors.grey.shade300,
            ),
          );
        }
      }),
    );
  }

  void _submitReport() {
    setState(() {
      currentStep = (currentStep + 1).clamp(0, steps.length - 1);
    });

    print('Category: $selectedCategory');
    print('Title: ${titleController.text}');
    print('Description: ${descriptionController.text}');
    print('Location: ${locationController.text}');
    print('Reporter: ${reporterController.text}');
    print('Priority: $priority');
    print('Image Selected: ${_image != null}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Report'),
        backgroundColor: Colors.blue,
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
           
            const SizedBox(height: 12),
            GestureDetector(
              onTap: _pickImage,
              child: Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade300),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 4,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: _image != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.file(
                          _image!,
                          fit: BoxFit.cover,
                        ),
                      )
                    : Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.upload_file,
                                size: 50, color: Colors.orange),
                            SizedBox(height: 10),
                            Text(
                              'Browse File',
                              style: TextStyle(
                                  color: Colors.orange,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16),
                            ),
                            SizedBox(height: 6),
                            Text(
                              'Max upload size: 4 MB. Only PDF/Image allowed.',
                              style:
                                  TextStyle(fontSize: 14, color: Colors.grey),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
              ),
            ),

            const SizedBox(height: 20),

            /// --- Title Section ---
            TextField(
              controller: titleController,
              decoration: InputDecoration(
                labelText: 'Title',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 14),
              ),
            ),

            const SizedBox(height: 20),

            /// --- Description Section ---
            TextField(
              controller: descriptionController,
              maxLines: 4,
              decoration: InputDecoration(
                labelText: 'Description',
                alignLabelWithHint: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 14),
              ),
            ),

            const SizedBox(height: 20),

            DropdownButtonFormField<String>(
              value: selectedCategory,
              items: categories
                  .map((cat) => DropdownMenuItem(
                        value: cat,
                        child: Text(cat),
                      ))
                  .toList(),
              onChanged: (value) {
                setState(() {
                  selectedCategory = value!;
                });
              },
              decoration: InputDecoration(
                labelText: 'Select Category',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),

            const SizedBox(height: 20),

            TextField(
              controller: locationController,
              decoration: InputDecoration(
                labelText: 'Location',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 14),
              ),
            ),

            const SizedBox(height: 20),

            TextField(
              controller: reporterController,
              decoration: InputDecoration(
                labelText: 'Reporter Name',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 14),
              ),
            ),

            const SizedBox(height: 30),

            buildTimeline(),

            const SizedBox(height: 30),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _submitReport,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Submit Report',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
