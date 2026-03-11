export interface SelfKeyPairRecord {
  user_id: string;
  public_key: JsonWebKey;
  private_key: JsonWebKey;
  created_at: string;
  updated_at: string;
}

export interface UserPublicKeyRecord {
  user_id: string;
  public_key: JsonWebKey;
  updated_at: string;
}

export interface UserPublicKeyApiRecord {
  user_id: string;
  public_key: JsonWebKey;
}
