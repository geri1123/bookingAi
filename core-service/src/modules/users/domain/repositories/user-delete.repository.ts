export abstract class UserDeleteRepository {
  abstract delete(id: string): Promise<void>;
}