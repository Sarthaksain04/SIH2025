import 'package:flutter/material.dart';

class YourCommunities extends StatelessWidget {
  const YourCommunities({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Communities'),
        backgroundColor: Colors.blue,
      ),
      body: const Center(
        child: Text(
          'No communities yet',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
