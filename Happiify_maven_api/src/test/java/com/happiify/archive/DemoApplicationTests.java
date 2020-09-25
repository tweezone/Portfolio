package com.happiify.archive;
import com.happiify.utils.CGEncryptor;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.crypto.NoSuchPaddingException;
import java.io.*;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {

	static final String uploadedFileFolder = "/Users/chenguoyan/Desktop/uploadedfile/";

	@Test
	public void contextLoads() {


	}




	void encryptFile(String filePath, String fileName, String password) {
		FileOutputStream fileOutputStream = null;
		String base64Content = fileToBase64(filePath + fileName);
		System.out.println(base64Content);
		try {
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (fileOutputStream != null) {
				try {
					fileOutputStream.flush();
					fileOutputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	public String fileToBase64(String path) {
		String base64 = null;
		InputStream in = null;
		try {
			File file = new File(path);
			in = new FileInputStream(file);
			byte[] bytes = new byte[in.available()];
			base64 = Base64.getEncoder().encodeToString(bytes);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return base64;
	}

	@Test
	public void myTest02() throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeySpecException, IOException, InvalidKeyException, InvalidAlgorithmParameterException {
		CGEncryptor encryptor = new CGEncryptor("hello1234");
		//encryptor.encrypt(uploadedFileFolder+"t03.zip");
		encryptor.decrypt(uploadedFileFolder+"t03.zip");
	}

}
