package com.hassansound.app

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.hassansound.app.ui.navigation.HassanSoundBottomBar
import com.hassansound.app.ui.screens.*
import com.hassansound.app.ui.theme.HassanSoundTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            HassanSoundTheme {
                val navController = rememberNavController()
                var currentRoute by remember { mutableStateOf("home") }

                // Storage Access Framework launcher for PDF / TXT import
                val documentPicker = rememberLauncherForActivityResult(
                    contract = ActivityResultContracts.OpenDocument()
                ) { uri: Uri? ->
                    uri?.let {
                        // Pass uri to ViewModel or Repository for extraction
                    }
                }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        HassanSoundBottomBar(
                            currentRoute = currentRoute,
                            onNavigate = { route ->
                                currentRoute = route
                                navController.navigate(route) {
                                    popUpTo("home") { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "home",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("home") {
                            HomeScreen(
                                onOpenBook = { bookId -> navController.navigate("player/$bookId") },
                                onImportClick = { documentPicker.launch(arrayOf("application/pdf", "text/plain")) }
                            )
                        }
                        composable("library") {
                            LibraryScreen(
                                onOpenBook = { bookId -> navController.navigate("reader/$bookId") },
                                onImportClick = { documentPicker.launch(arrayOf("application/pdf", "text/plain")) }
                            )
                        }
                        composable("player/{bookId}") { backStackEntry ->
                            val bookId = backStackEntry.arguments?.getString("bookId") ?: ""
                            PlayerScreen(bookId = bookId, onNavigateBack = { navController.popBackStack() })
                        }
                        composable("reader/{bookId}") { backStackEntry ->
                            val bookId = backStackEntry.arguments?.getString("bookId") ?: ""
                            ReaderScreen(bookId = bookId, onNavigateBack = { navController.popBackStack() })
                        }
                        composable("settings") {
                            SettingsScreen()
                        }
                    }
                }
            }
        }
    }
}
