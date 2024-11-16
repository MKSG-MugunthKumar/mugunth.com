#!/usr/bin/env fish

function clean_build
    echo "Cleaning previous build..."
    rm -rf node_modules public resources
    rm -f go.mod go.sum
    npm ci
    hugo mod init github.com/MKSG-MugunthKumar/mugunth.com
    hugo mod get -u
    hugo --gc --minify
end

function deploy_locally
    echo "Starting local development server..."
    hugo server -D --disableFastRender
end

function deploy_resume_worker
    echo "Deploying resume PDF generator worker..."
    cd resume-pdf-generator
    wrangler deploy
    cd ..
end

function show_help
    echo "Usage: deploy [command]"
    echo "Commands:"
    echo "  clean         - Clean and rebuild the project"
    echo "  local         - Start local development server"
    echo "  resume-worker - Deploy the resume PDF generator worker"
    echo "  help          - Show this help message"
end

# Main command handling
switch $argv[1]
    case "clean"
        clean_build
    case "local"
        deploy_locally
    case "resume-worker"
        deploy_resume_worker
    case "help"
        show_help
    case ""
        echo "Error: No command specified"
        show_help
        exit 1
    case '*'
        echo "Error: Unknown command '$argv[1]'"
        show_help
        exit 1
end
