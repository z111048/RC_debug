import json
from base64 import b64encode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Random import get_random_bytes

def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def encrypt_data(data, key):
    # 將數據轉換為 JSON 字符串
    json_data = json.dumps(data, ensure_ascii=False).encode('utf-8')
    
    # 生成隨機的 16 字節初始化向量
    iv = get_random_bytes(16)
    
    # 創建 AES 密碼對象
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    # 加密數據
    ct_bytes = cipher.encrypt(pad(json_data, AES.block_size))
    
    # 將加密後的數據、IV 和密鑰合併並進行 Base64 編碼
    encrypted_data = b64encode(iv + ct_bytes).decode('utf-8')
    
    return encrypted_data

# 讀取原始 JSON 文件
input_file = 'original_proofreading_results.json'  # 請將此替換為您的輸入文件名
data = read_json_file(input_file)

# 生成一個 32 字節的隨機密鑰（256 位）
key = get_random_bytes(32)

# 加密數據
encrypted = encrypt_data(data, key)

# 將加密後的數據保存到文件
output_file = 'web_ready_proofreading_results.json'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(encrypted)

# 將密鑰保存到一個單獨的文件（在實際應用中應更安全地處理）
key_file = 'encryption_key.txt'
with open(key_file, 'wb') as f:
    f.write(key)

print(f"原始數據已從 {input_file} 讀取")
print(f"加密數據已保存到 {output_file}")
print(f"密鑰已保存到 {key_file}")
print("請妥善保管密鑰文件，不要將其上傳或分享！")

# 顯示密鑰的 Base64 編碼（用於 JavaScript 解密）
base64_key = b64encode(key).decode('utf-8')
print("\n用於 JavaScript 解密的 Base64 編碼密鑰:")
print(base64_key)