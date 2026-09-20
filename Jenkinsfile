pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    // Jenkins started by Homebrew has a minimal PATH; make sure node/npm are found.
    PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
    CI = 'true'                       // playwright.config.ts: enables retries, no browser window
    PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/.pw-browsers"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'node -v && npm -v'
        sh 'npm ci'
      }
    }

    stage('Install browser') {
      steps {
        sh 'npx playwright install chromium'
      }
    }

    stage('Type check') {
      steps {
        sh 'npm run typecheck'
      }
    }

    stage('Run UI tests') {
      steps {
        sh 'npm test'
      }
    }
  }

  post {
    always {
      // Test results (pass/fail trend graph in Jenkins)
      junit allowEmptyResults: true, testResults: 'results/junit.xml'
      // HTML report, screenshots and traces: download from the build's Artifacts
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
    }
    success { echo 'All tests passed.' }
    failure { echo 'Tests failed. Check the JUnit results and archived report.' }
  }
}
