export interface IPrismaService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
