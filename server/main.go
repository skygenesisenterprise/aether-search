package main

import (
	"fmt"
	"os"
	"runtime"

	"github.com/gin-gonic/gin"

	"github.com/skygenesisenterprise/aether-search/server/src/config"
	"github.com/skygenesisenterprise/aether-search/server/src/interfaces"
	"github.com/skygenesisenterprise/aether-search/server/src/middleware"
	"github.com/skygenesisenterprise/aether-search/server/src/routes"
	"github.com/skygenesisenterprise/aether-search/server/src/services"
	"gorm.io/gorm"
)

func displayBanner() {
	fmt.Printf("\n")
	fmt.Printf("\033[1;36m    ██╗    ██╗██╗  ██╗ █████╗ ████████╗██╗  ██╗███████╗████████╗\n")
	fmt.Printf("\033[1;36m    ██║    ██║██║  ██║██╔══██╗╚══██╔══╝██║  ██║██╔════╝╚══██╔══╝\n")
	fmt.Printf("\033[1;36m    ██║ █╗ ██║███████║███████║   ██║   ███████║█████╗     ██║   \n")
	fmt.Printf("\033[1;36m    ██║███╗██║██╔══██║██╔══██║   ██║   ██╔══██║██╔══╝     ██║   \n")
	fmt.Printf("\033[1;36m    ╚███╔███╔╝██║  ██║██║  ██║   ██║   ██║  ██║███████╗   ██║   \n")
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;33m    ╔══════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("\033[1;33m    ║                     Aether Search                            ║\n")
	fmt.Printf("\033[1;33m    ║               Enterprise Account Management                  ║\n")
	fmt.Printf("\033[1;33m    ║                   Version 1.0.0-alpha                        ║\n")
	fmt.Printf("\033[1;33m    ╚══════════════════════════════════════════════════════════════╝\n")
	fmt.Printf("\033[0;37m")
	fmt.Printf("\n")
	fmt.Printf("\033[1;32m[✓] System Architecture: %s\033[0m\n", runtime.GOARCH)
	fmt.Printf("\033[1;32m[✓] Operating System: %s\033[0m\n", runtime.GOOS)
	fmt.Printf("\033[1;32m[✓] Go Version: %s\033[0m\n", runtime.Version())
	fmt.Printf("\033[1;32m[✓] CPU Cores: %d\033[0m\n", runtime.NumCPU())
	fmt.Printf("\033[1;32m[✓] Process ID: %d\033[0m\n", os.Getpid())
	fmt.Printf("\n")
}

func main() {
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	displayBanner()

	cfg := config.LoadConfig()

	// Initialize database if DSN is provided
	var dbService interfaces.IDatabaseService
	var db *gorm.DB

	// Check if we should use embedded database
	useEmbeddedDB := os.Getenv("USE_EMBEDDED_DB") == "true"

	if useEmbeddedDB {
		// For embedded DB, use Unix socket or TCP on localhost with the correct credentials
		dbHost := os.Getenv("DB_HOST")
		if dbHost == "" {
			dbHost = "localhost"
		}
		dbPort := os.Getenv("DB_PORT")
		if dbPort == "" {
			dbPort = "5432"
		}
		dbUser := os.Getenv("DB_USER")
		if dbUser == "" {
			dbUser = "aether"
		}
		dbName := os.Getenv("DB_NAME")
		if dbName == "" {
			dbName = "etheria_account"
		}
		dbPassword := os.Getenv("DB_PASSWORD")
		if dbPassword == "" {
			dbPassword = os.Getenv("POSTGRES_PASSWORD")
			if dbPassword == "" {
				dbPassword = "password"
			}
		}

		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			dbHost, dbUser, dbPassword, dbName, dbPort)

		var err error
		dbService, err = services.NewDatabaseService(dsn)
		if err != nil {
			fmt.Printf("\033[1;33m[!] Warning: Failed to connect to embedded database: %v\033[0m\n", err)
			fmt.Printf("\033[1;33m[!] Running in database-less mode\033[0m\n")
		} else {
			db = dbService.GetDB()
			fmt.Printf("\033[1;32m[✓] Embedded database connected\033[0m\n")

			// Initialiser la variable globale pour la compatibilité avec les controllers
			services.DB = db
			fmt.Printf("\033[1;32m[✓] Global DB reference initialized\033[0m\n")

			serviceKeyService := services.NewServiceKeyService(db)
			if err := serviceKeyService.EnsureSystemKey(cfg.SystemKey); err != nil {
				fmt.Printf("\033[1;33m[!] Warning: Failed to ensure system key in database: %v\033[0m\n", err)
			} else {
				fmt.Printf("\033[1;32m[✓] System key validated in database\033[0m\n")
			}
		}
	} else if dsn := os.Getenv("DATABASE_URL"); dsn != "" {
		var err error
		dbService, err = services.NewDatabaseService(dsn)
		if err != nil {
			fmt.Printf("\033[1;31m[✗] Failed to connect to database: %v\033[0m\n", err)
			os.Exit(1)
		}
		db = dbService.GetDB()
		fmt.Printf("\033[1;32m[✓] Database connected\033[0m\n")

		// Initialiser la variable globale pour la compatibilité avec les controllers
		services.DB = db
		fmt.Printf("\033[1;32m[✓] Global DB reference initialized\033[0m\n")

		serviceKeyService := services.NewServiceKeyService(db)
		if err := serviceKeyService.EnsureSystemKey(cfg.SystemKey); err != nil {
			fmt.Printf("\033[1;33m[!] Warning: Failed to ensure system key in database: %v\033[0m\n", err)
		} else {
			fmt.Printf("\033[1;32m[✓] System key validated in database\033[0m\n")
		}
	} else {
		fmt.Printf("\033[1;33m[!] Warning: DATABASE_URL not set and USE_EMBEDDED_DB not enabled, running in database-less mode\033[0m\n")
	}

	router := gin.New()
	router.Use(gin.Recovery())

	router.Use(middleware.AdaptiveCORSMiddleware())

	routes.SetupRoutes(router, cfg.SystemKey, services.NewServiceKeyService(db), dbService)

	addr := fmt.Sprintf(":%s", cfg.Port)
	fmt.Printf("\033[1;32m[✓] Server starting on %s\033[0m\n", addr)
	fmt.Printf("\033[1;36m[✓] API available at http://localhost%s/api/v1\033[0m\n", addr)
	fmt.Printf("\n")

	if err := router.Run(addr); err != nil {
		fmt.Printf("\033[1;31m[✗] Failed to start server: %v\033[0m\n", err)
		os.Exit(1)
	}
}
