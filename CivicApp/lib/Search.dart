import 'package:flutter/material.dart';

class Search extends StatefulWidget {
  const Search({super.key});

  @override
  State<Search> createState() => _SearchState();
}

class _SearchState extends State<Search> {
  final TextEditingController searchController = TextEditingController();

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false, // Removes default back arrow
        backgroundColor: Colors.transparent, // No AppBar color
        elevation: 0, // Removes shadow
        title: Container(
          height: 50,
          decoration: BoxDecoration(
            color: Colors.grey.shade200, // Soft, eye-pleasing background
            borderRadius: BorderRadius.circular(12),
          ),
          child: TextField(
            controller: searchController,
            decoration: InputDecoration(
              prefixIcon: const Icon(Icons.search, color: Colors.grey),
              hintText: 'Search...',
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 14),
            ),
            onChanged: (value) {
              print('Searching for: $value');
              // Implement search logic here
            },
          ),
        ),
      ),
      body: const Center(
        child: Text(
          'Search Results Appear Here',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
