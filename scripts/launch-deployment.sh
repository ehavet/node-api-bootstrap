#!/bin/bash
APPLICATION_VERSION=$(eval "$APPLICATION_VERSION")
git clone --single-branch --branch "$FALCO_OPS_BRANCH"  https://gitlab-ci-token:${CI_JOB_TOKEN}@gitlab.com/appenin/falco-ops.git
echo "application_git_repo: git@gitlab.com:appenin/falco-api.git" >> falco-ops/sites/ansible_extra_vars.yml
echo "application_version: $APPLICATION_VERSION" >> falco-ops/sites/ansible_extra_vars.yml
echo "application_environment: $DEPLOY_ENVIRONMENT" >> falco-ops/sites/ansible_extra_vars.yml
cd falco-ops
git-crypt unlock
pip install -r requirements.pip
ansible-galaxy role install -r requirements.yml

if [ "${ZERO_DOWNTIME,,}" = "yes" ]; then
  echo "##### Deploy API to $DEPLOY_ENVIRONMENT in 0 downtime mode #####"
  ansible-playbook -i "inventory.$DEPLOY_ENVIRONMENT" --tags "app, zerodowntime, certificate-check-only" --extra-vars "@sites/ansible_extra_vars.yml" sites/api.appenin.fr.yml
else
  echo "##### Deploy API to $DEPLOY_ENVIRONMENT in parallel mode #####"
  echo "rolling_deployment_step: '100%'" >> sites/ansible_extra_vars.yml
  ansible-playbook -i "inventory.$DEPLOY_ENVIRONMENT" --tags "app" --extra-vars "@sites/ansible_extra_vars.yml" sites/api.appenin.fr.yml
fi