/***********************************
 *  EKS Template                   *
 *  Version: eks-v.0.0.5           *
 *  Last Updated Date: 2023.01.04  *
************************************/

@Library('share-library@master') _
import com.kal.slo.BuildResultVO
import com.kal.slo.GitUrlVO
import com.kal.slo.KalUtil
import groovy.json.JsonOutput

currentBuild.result = 'SUCCESS'

// Jira에 전달하기 위한 자료형
BuildResultVO buildResultVO = null

// git 저장소와 Url을 관리하기 위한 자료형
def gitUrlVOs = []

def jsonCodeDeployResults = []

pipeline {
  agent {
    node {
      label 'jenkins_worker'
      customWorkspace getWs("/data/jenkins_worker/workspace/${JOB_NAME}", getLockName(params.BRANCH, params.REQUEST_TYPE))
    }
  }

  environment {
    lockName = ''
    bizDomain = ''
    gitHashs = ''
    isFolderSplit = true
    projectName = ''
    serviceName = ''
    roleAccount = ''
    roleArn = ''
    buildStage = ''
    ecrTag = ''
    ecrName = ''
    ecrURI = ''
    // 빌드 파라미터 대체
    APP_BUILD_CMD = ''
  }

  options {
    // STG, PRD는 Jekins의 env.WORKSPACE에서 작업을 수행하고
    // DEV, SONAR_FEA, SONAR_STG env.TEMP_WORKSPACE에서 작업을 하기위한 변수 설정
    // lock('resource': getLockName(params.BRANCH, params.REQUEST_TYPE))
    timeout(time:1, unit: 'HOURS')
  }

  stages {
    stage('init') {
      steps {
        script {

          env.TEMP_WORKSPACE = env.WORKSPACE
          // "DEV"(개발), "FEA"(소나스캔), "STG", "HOT",(스테이지) "PRD"(운영) return
          env.PHASE = KalUtil.branchNameToPhase(params.BRANCH)

          //빌드 태그명 변경
          updateDisplay()
          // Jira에 넘겨줘야할 BuildResultVO 객체 생성

          buildResultVO = new BuildResultVO(params.ISSUE_DEPLOY_KEY, env.PHASE, env.STAGE_NAME, BUILD_URL)
          // requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)
          //params.GIT_URL를 객체로 변환
          gitUrlVOs = KalUtil.branchNameToGitUrlVOs(params.GIT_URL)
          // dev, stg, prd 값 셋팅
          buildStage = KalUtil.phaseToStage(env.PHASE)
          bizDomain = params.OWNER.toLowerCase()
          projectName = JOB_NAME.split('/')[0].toLowerCase()
          serviceName = JOB_BASE_NAME.toLowerCase()
          lockName = getLockName(params.BRANCH, params.REQUEST_TYPE)
          // 배포 명령어 설정
          APP_BUILD_CMD = 'yarn run build:' + buildStage
          (roleAccount, roleArn) = getRoleAccountArn(buildStage, params.ACCOUNT_OWNER)

          echo "Pipeline Version=${EKS_PIPELINE_VERSION}"
          echo "params=${params}"
          echo "buildResultVO=${buildResultVO.toString()}"
          echo "gitUrlVOs=${gitUrlVOs.toString()}"
          echo "buildStage=${buildStage}"
          echo "owner=${bizDomain}"
          echo "projectName=${projectName}"
          echo "serviceName=${serviceName}"
          echo "roleAccount=${roleAccount}"
          echo "roleArn=${roleArn}"
          echo "isFolderSplit=${isFolderSplit}"
          echo "APP_BUILD_CMD=${APP_BUILD_CMD}"
          echo "SKIP_STAGE=${SKIP_STAGE}"
        }
      }
    }
    stage('Get Source') {
      when { expression{ !params.DEBUG.toBoolean() } }
      steps {
        script {
          // requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)
          gitHashs = getSourceNoClean(gitUrlVOs, isFolderSplit)
        }
      }
    }

    // stage('Merge-Master') {
    //   when { expression{ !params.DEBUG.toBoolean() } }
    //   steps {
    //     script {
    //       requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)
    //       // stg브랜치를 prd브랜치에 머지 (정기-PRD일 때만 수행)
    //       masterMerge(gitUrlVOs, isFolderSplit)
    //     }
    //   }
    // }

    stage('Install-Package') {
      when { expression{ !(params.REQUEST_TYPE == 'Sonar' || params.RUNTIME == 'JAVA') } }
      steps {
        script {
          // requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)

          if (params.RUNTIME == 'NODE') {
            runInstallNodePackage(serviceName)
          } else if (params.RUNTIME == 'PYTHON') {
            runInstallPythonPackage(serviceName)
          }
        }
      }
    }

    stage('Build-App') {
      when { expression{ !(params.REQUEST_TYPE == 'Sonar' || (params.SKIP_STAGE && buildStage == "stg")) } }
      steps {
        script {
          // requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)

          if (params.RUNTIME == 'JAVA') {
            runBuildJavaApp(lockName, serviceName, buildStage)
          } else if (params.RUNTIME == 'NODE') {
            runBuildNodeApp(serviceName, buildStage)
          } else if (params.RUNTIME == 'PYTHON') {
            runBuildPythonApp(serviceName)
          }
        }
      }
    }

    stage('Build-Image') {
      when { expression{ !(params.REQUEST_TYPE == 'Sonar' || (params.SKIP_STAGE && buildStage == "stg") || params.DEPLOY_RESOURCE == 'S3') } }
      steps {
        script {
          // requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)

          ecrTag = 'BLD-' + currentBuild.number
          ecrName = "${env.REGION_PREFIX}-ecr-${bizDomain}-${buildStage}-${serviceName}"
          ecrURI = "${roleAccount}.dkr.ecr.${env.REGION}.amazonaws.com/${ecrName}:${ecrTag}"

          if (params.DEBUG) {
            echo "ecrTag=${ecrTag}"
            echo "ecrName=${ecrName}"
            echo "ecrURI=${ecrURI}"

            return "${env.STAGE_NAME}"
          }

          container(name: 'kaniko', shell: '/busybox/sh') {
          sh """#!/busybox/sh
                /kaniko/executor \\
                --context="${TEMP_WORKSPACE}/${serviceName}/" \\
                --dockerfile="${TEMP_WORKSPACE}/${serviceName}/Dockerfile" \\
                --destination="${ecrURI}" \\
          """
          }
        }
      }
    }

    stage('Move-ECRTag') {
      when { expression{ !(params.REQUEST_TYPE == 'Sonar' || params.DEPLOY_RESOURCE == 'S3') } }
      steps {
        script {
          requestMoveECRLatestTag(roleAccount, ecrName, ecrTag, env.ROLE_JENKINS_WORKER )
        }
      }
    }

    stage('SonarQube') {
      when { expression{ (env.G_SONAR_RUN == 'true' && params.REQUEST_TYPE == 'Sonar') } }
      steps {
        script {
          // requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)

          def sonarCmd = ''

          //PullRequest생성시 사전 스캐닝
          if (params.PRID != null && params.PRID != '') {
            sonarCmd = "${tool 'efs_sonar'}/bin/sonar-scanner \
              -Dsonar.projectKey=${JOB_BASE_NAME} \
              -Dsonar.pullrequest.branch=${params.BRANCH} \
              -Dsonar.pullrequest.key=${params.PRID} \
              -Dsonar.pullrequest.base=stage \
              -Dsonar.cpd.exclusions=. \
              -Dsonar.sources=${JAVA_SOURCES} \
              -Dsonar.nodejs.executable=/data/jenkins_worker/build_tools/nvm/versions/node/v16.19.0/bin/node "
          } else { //sonar-run-tag 생성 시 base 스캐닝
            sonarCmd = "${tool 'efs_sonar'}/bin/sonar-scanner \
              -Dsonar.projectKey=${JOB_BASE_NAME} \
              -Dsonar.branch.name=${params.BRANCH} \
              -Dsonar.cpd.exclusions=. \
              -Dsonar.sources=${JAVA_SOURCES} \
              -Dsonar.nodejs.executable=/data/jenkins_worker/build_tools/nvm/versions/node/v16.19.0/bin/node "
          }
          //sonaQube - 스캔
          dir("${TEMP_WORKSPACE}/${serviceName}") {
            withSonarQubeEnv('ALM SonarQube') {
              sh "${sonarCmd}"
            }
            //sonarQube - 분석
            waitForSonar(10, '.scannerwork/report-task.txt')
          }
        }
      }
    }

    stage('Deploy') {
      when { expression{ !(params.REQUEST_TYPE == 'Sonar' || (params.SKIP_STAGE && buildStage == "stg")) } }
      steps {
        script {
          requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)

          if (params.DEPLOY_RESOURCE == 'EKS') {
            runDeployEKS(serviceName, buildStage, bizDomain)
            def output = JsonOutput.toJson([name: "${bizDomain}-${buildStage}-${serviceName}", revision: "${env.lastImageTag}", k8sObject: "${params.EKS_OBJECT}"])
            jsonCodeDeployResults.add(output)
          } else if (params.DEPLOY_RESOURCE == 'S3') {
            s3Prefix = "${env.REGION_PREFIX}-s3-${bizDomain}-${buildStage}-${serviceName}"
            runDeployS3(serviceName, roleAccount, s3Prefix)
          }
        }
      }
    }

    stage('Health Check') {
      when { expression{ !(params.REQUEST_TYPE == 'Sonar' || (params.SKIP_STAGE && buildStage == "stg") || params.SKIP_HEALTH_CHECK || params.DEBUG) } }
      steps {
        script {
          def healthCheckUrl
          def response

          boolean isHealth = false
          long startTime = System.currentTimeMillis()

          switch (buildStage) {
            case 'dev':
              healthCheckUrl = params.HEALTHCHECK_URL_DEV
              break
            case 'stg':
              healthCheckUrl = params.HEALTHCHECK_URL_STG
              break
            default:
              healthCheckUrl = params.HEALTHCHECK_URL_PRD
              break
          }

          // 2분간 healthcheck retry
          while (isHealth || (System.currentTimeMillis() - startTime) < 120000) {
            response = httpRequest url:"$healthCheckUrl", validResponseCodes:'100:599'
            if (response != null && response.status == 200) {
              isHealth = true
              break
            }
          }
          if (isHealth == false) {
            throw new Exception('HealthCheck failed: Returned Code is ' + response.status)
          }
        }
      }
    }

    stage('Create Tag') {
      when { expression{ !(params.REQUEST_TYPE == 'Sonar' || params.DEBUG) } }
      steps {
        script {
          requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_STATUS)

          createTag(gitUrlVOs, isFolderSplit)
        }
      }
    }
  }
  post {
    always {
      echo 'always post'
      script{
        if (params.DEBUG) {
          echo "Skip ${env.STAGE_NAME}"
          return "${env.STAGE_NAME}"
        }
        //Jira에 delay_bluegreen이나 rollback에 필요한 JSON data 전달
        // requestBuildResult(buildResultVO, env.JIRA_REST_SET_DEPLOY_RESULT, jsonCodeDeployResults, 'InProgress')
        //Bitbucket에 성공/실패 여부 전달
        requestBitBucketBuildResult(gitHashs)
      }

    }
    failure {
      echo 'failure post'
    // echo "Exception=${e}"
    // currentBuild.result = "FAILURE"
    }
    success {
      echo 'success post'
    }
  }
}

def getRoleAccountArn(paramBuildStage, paramAccountOwner) {
  def roleAccount = env.ACCOUNT_KEAPPDEV
  def roleArn = env.ROLE_APP_DEV_JENKINS_WORKER

  if (paramBuildStage == 'dev') {
    switch (paramAccountOwner) {
      case 'ECOM':
        roleAccount = env.ACCOUNT_KEAPPECOMDEV
        roleArn = env.ROLE_APPECOM_DEV_JENKINS_WORKER
        break
      case 'DATA':
        roleAccount = env.ACCOUNT_KEAPPDATADEV
        roleArn = env.ROLE_APPDATA_DEV_JENKINS_WORKER
        break
      default:
        roleAccount = env.ACCOUNT_KEAPPDEV
        roleArn = env.ROLE_APP_DEV_JENKINS_WORKER
        break
    }
    } else if (paramBuildStage == 'stg') {
      switch (paramAccountOwner) {
        case 'ECOM':
          roleAccount = env.ACCOUNT_KEAPPECOMSTG
          roleArn = env.ROLE_APPECOM_STG_JENKINS_WORKER
          break
        default:
          roleAccount = env.ACCOUNT_KEAPPSTG
          roleArn = env.ROLE_APP_STG_JENKINS_WORKER
        break
    }
    } else if (paramBuildStage == 'prd') {
      switch (paramAccountOwner) {
        case 'ECOM':
          roleAccount = env.ACCOUNT_KEAPPECOMPROD
          roleArn = env.ROLE_APPECOM_PRD_JENKINS_WORKER
          break
        case 'DATA':
          roleAccount = env.ACCOUNT_KEAPPDAT
          roleArn = env.ROLE_APPDATA_PRD_JENKINS_WORKER
          break
        default:
          roleAccount = env.ACCOUNT_KEAPPPROD
          roleArn = env.ROLE_APP_PRD_JENKINS_WORKER
          break
    }
  }

  return [roleAccount, roleArn]
}

def runScript(paramScript) {
  echo "== Script ==\n${paramScript}"
  if (params.DEBUG) {
    echo 'Skipped to run script.'
    return
  }

  sh "$paramScript"
}

def runScriptWithStdout(paramScript) {
  echo "== Script ==\n${paramScript}"
  if (params.DEBUG) {
    echo 'Skipped to run script.'
    return null
  }

  return sh(script: "$paramScript", returnStdout: true)
}

def runInstallNodePackage(paramServiceName) {
  dir("/root/${paramServiceName}") {
      def prevNodeModulesHash = null
      def currNodeModulesHash = null

      runScript("rclone copy ${env.TEMP_WORKSPACE}/${paramServiceName}/ . --create-empty-src-dirs --multi-thread-streams=6")

      if (fileExists('node_modules.tgz') || params.DEBUG) {
        echo 'Found: node_modules.tgz'
        runScript('tar --use-compress-program=unpigz -xf node_modules.tgz')
        prevNodeModulesHash = runScriptWithStdout("md5sum node_modules/.yarn-integrity | awk '{ print \$1 }'")
      }

      def multiLinesScript = '''\
          [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh" > /dev/null 2>&1 \
          && nvm use ${NODE_VERSION} > /dev/null 2>&1 \
          && node --version \
          && yarn install --silent --prefer-offline --cache-folder ./cache'''.stripIndent()

      runScript(multiLinesScript)
      currNodeModulesHash = runScriptWithStdout("md5sum node_modules/.yarn-integrity | awk '{ print \$1 }'")

      echo "prevNodeModulesHash=${prevNodeModulesHash}"
      echo "currNodeModulesHash=${currNodeModulesHash}"

      if (prevNodeModulesHash != currNodeModulesHash || params.DEBUG) {
        echo 'Updated: node_modules changed'
        multiLinesScript = """\
                  tar --use-compress-program=pigz -cf node_modules.tgz ./node_modules ./cache \
                  && cp -rf node_modules.tgz ${env.TEMP_WORKSPACE}/${paramServiceName}""".stripIndent()
        runScript(multiLinesScript)
    } else {
        echo 'Skipped: node_modules not changed'
    }
  }
}

def runInstallPythonPackage(paramServiceName) {
}

def runBuildJavaApp(paramLockName, paramServiceName, paramBuildStage=null) {
  dir("${TEMP_WORKSPACE}/${paramServiceName}") {
    def userCache = (paramLockName == 'DEV') ? 'User-Dev-Cache' : 'User-StgPrd-Cache'
    def prjCache  = (paramLockName == 'DEV') ? 'Prj-Dev-Cache' : 'Prj-StgPrd-Cache'

    if (params.DEBUG) {
      env.BUILD_TOOLS_EXT = '/data/jenkins_worker/build_tools'
      env.GRADLE_CACHE_HOME = '/data/jenkins_worker/gradle_repos'
    }

    def javaHome = "${BUILD_TOOLS_EXT}/jdk/current-${JAVA_VERSION}"
    def gradleHome = "${BUILD_TOOLS_EXT}/gradle/gradle-${GRADLE_VERSION}"
    def gradleUserHome = "${GRADLE_CACHE_HOME}/${JOB_BASE_NAME}/${userCache}"
    def path = "${javaHome}/bin:${gradleHome}/bin:$PATH"

    withEnv(["JAVA_HOME=${javaHome}",
            "GRADLE_HOME=${gradleHome}",
            "GRADLE_USER_HOME=${gradleUserHome}",
            "PATH=${path}"]) {
      if (params.DEBUG) {
        sh """
          echo JAVA_HOME=\$JAVA_HOME
          echo GRADLE_HOME=\$GRADLE_HOME
          echo GRADLE_USER_HOME=\$GRADLE_USER_HOME
          echo PATH=\$PATH
        """
      }
      if (paramBuildStage == null) {
        runScript("${APP_BUILD_CMD} --project-cache-dir ${GRADLE_CACHE_HOME}/${JOB_BASE_NAME}/${prjCache}")
      } else {
        runScript("${APP_BUILD_CMD} -P profile=${paramBuildStage} --refresh-dependencies --project-cache-dir ${GRADLE_CACHE_HOME}/${JOB_BASE_NAME}/${prjCache}")
      }
    }
  }
}

def runBuildNodeApp(paramServiceName, paramBuildStage) {
  dir("/root/${paramServiceName}") {
    if (params.DEBUG) {
      env.BUILD_TOOLS_EXT = '/data/jenkins_worker/build_tools'
    }

    withEnv(["NVM_DIR=${BUILD_TOOLS_EXT}/nvm"]) {
      if (params.DEBUG) {
        sh """
          echo NVM_DIR=\$NVM_DIR
        """
      }
      def multiLinesScript = """\
        [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh" > /dev/null 2>&1 \
        && nvm use ${NODE_VERSION} > /dev/null 2>&1 \
        && node --version \
        && ${APP_BUILD_CMD}""".stripIndent()
        runScript(multiLinesScript)
        runScript("cp -rf build ${env.TEMP_WORKSPACE}/${paramServiceName}")
      }
  }
}

def runBuildPythonApp(paramServiceName) {
  dir("${TEMP_WORKSPACE}/${paramServiceName}") {
    if (params.DEBUG) {
      env.BUILD_TOOLS_EXT = '/data/jenkins_worker/build_tools'
    }

    withEnv(["PYENV_ROOT=${BUILD_TOOLS_EXT}/pyenv",
      "PATH=${BUILD_TOOLS_EXT}/pyenv/bin:${BUILD_TOOLS_EXT}/pyenv/shims:$PATH"]) {
        if (params.DEBUG) {
          sh """
                      echo PYENV_ROOT=\$PYENV_ROOT
                      echo PATH=\$PATH
                  """
        }
      runScript('echo runBuildPythonApp')
    }
  }
}

def runDeployEKS(paramServiceName, paramBuildStage, paramAccountOwner) {
  lock(resource: 'argo_lock') {
    // ARGO_WORKSPACE는 dockerfile에 적용되어 있음
    dir("${env.ARGO_WORKSPACE}") {
      //getSource-argocd
      getSourceConfig(env.ARGO_GIT_URL)

      def cmd = "cd ./app/*/*/*/${paramServiceName} && yq eval .release ./release-${paramBuildStage}.yaml"
      env.lastImageTag = sh(returnStdout: true, script: cmd).trim()
      echo "env.lastImageTag=${env.lastImageTag}"

      //배포 대상 폴더 검색 및 변경 사항 강제 생성(release.yaml)
      sh("""
        cd ./app/*/*/*/${paramServiceName}
        echo "release: BLD-${currentBuild.number}" > ./release-${paramBuildStage}.yaml
        cat ./release-${paramBuildStage}.yaml
      """)

      // commit 및 push한다
      sh "git commit -am 'release: BLD-${currentBuild.number}'"

      withCredentials([gitUsernamePassword(credentialsId: 'ifuser-bitbucket')]) {
        sh '''
            git pull --rebase origin master
            git push origin master
        '''
      }
    }
  }//argo lock end
  withCredentials([string(credentialsId: 'ifuser-argocd', variable: 'SECRET')]) { //set SECRET with the credential content
    sh "argocd app sync ${paramAccountOwner}-${paramBuildStage}-${paramServiceName} --server eks.koreanair.com --timeout ${params.ARGO_WAIT_TIMEOUT} --auth-token $SECRET"
    sh "argocd app wait ${paramAccountOwner}-${paramBuildStage}-${paramServiceName} --server eks.koreanair.com --timeout ${params.ARGO_WAIT_TIMEOUT} --auth-token $SECRET"
  }
}

def runDeployS3(paramServiceName, paramRoleAccount, paramS3Prefix) {
  dir("/root/${paramServiceName}") {
    withAWS(roleAccount:"${paramRoleAccount}", role:"${env.ROLE_JENKINS_WORKER}", useNode: true) {
      runScript("aws s3 sync build/static s3://${paramS3Prefix}/static --cache-control 'max-age=31536000'")
      runScript("aws s3 sync build/ s3://${paramS3Prefix}/ --exclude 'index.html' --cache-control 'max-age=604800'")
      runScript("aws s3 cp build/index.html s3://${paramS3Prefix}/ --cache-control 'no-store' --content-type 'text/html'")
      runScript("aws s3 sync build/ s3://${paramS3Prefix}/ --exclude 'index.html' --delete")
    }
  }
}

String getLockName(String branchName, String requestType) {
  if (branchName == 'develop' || branchName == 'dev_released' ) {
    return 'DEV'
  }
    else if (branchName == 'master'  || branchName == 'prd_released') {
    return 'PRD'
  }
    else if (branchName.startsWith('feat')) {
    return 'SONAR_FEA'
  }
    else if (branchName.startsWith('hotfix') || branchName == 'stg_released' ) {
    return 'STG'
  }
    else if (branchName == 'stage' || branchName == 'stg_released') {
    if (requestType == 'Sonar') {
      return 'SONAR_STG'
    }
    else {
      return 'STG'
    }
  }
  return 'DEV'
}

String getWs(String worksapce, String lockName) {
  if (lockName == 'PRD' || lockName == 'STG') {
    return "${worksapce}_${lockName}"
  }
    else {
    if (worksapce.indexOf(":\\") != -1) {
      if (lockName.indexOf('SONAR') == 0) {
        return "${worksapce}_${lockName}".replace('workspace', 'workspace_tmp')
      }
            else {
        return "${worksapce}_${lockName}"
            }
    }
        else {
      return "${worksapce}_${lockName}"
        }
    }
}
