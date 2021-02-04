#!/bin/sh
echo "Auditing npm dependencies with level: $AUDIT_LEVEL ($AUDIT_LEVEL_STATUS_CODE)"
yarn audit --audit-level=$AUDIT_LEVEL || exit_code=$?
if [ "$exit_code" -ge "$AUDIT_LEVEL_STATUS_CODE" ]; then exit 1; fi;