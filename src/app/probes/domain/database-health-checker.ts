export interface DatabaseHealthChecker {
    isConnectionEstablished(): Promise<boolean>
}
