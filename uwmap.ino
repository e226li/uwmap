#include <Arduino.h>
#include <BLEAdvertisedDevice.h>
#include <BLEDevice.h>
#include <BLEScan.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <esp_wpa2.h>
#include <esp_wifi.h>
#include <soc/rtc_cntl_reg.h>
#include <stdlib.h>

// local constants
#define EAP_ANONYMOUS_IDENTITY "anonymous@uwaterloo.ca"
#define EAP_IDENTITY "c82li@uwaterloo.ca"
#define EAP_USERNAME "c82li@uwaterloo.ca"
#define EAP_PASSWORD "aasifjslkfjsdklfj"
#define SSID "eduroam"
#define TEST_SSID "testing uwu"
#define TEST_PASS "uwuusowarm"
#define DEVICE_ID "3"

const String url = "https://api.uwmap.live/send-data/?device_id=";
const String string1 = String("&device_count=");

// server constants
const char *SV_AUTHORITY = "api.uwmap.live";
//const char *SV_URL = "https://api.uwmap.live/send-data/?device_id=" + DEVICE_ID + "&device_count=";
const char *SV_ROOT_CERT = \
"-----BEGIN CERTIFICATE-----\n" \
"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\n" \
"-----END CERTIFICATE-----\n";

BLEScan *pBLEScan = NULL; // networking
HTTPClient https;
WiFiClientSecure client;

class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {
    // ss << " new " << advertisedDevice.toString().c_str();
  }
};

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); // disable brownout

  Serial.begin(115200); // serial
  Serial.println("hi");
  pinMode(2,OUTPUT); // led

  BLEDevice::init(""); // bluetooth
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);
  pBLEScan->setInterval(500);
  pBLEScan->setWindow(250);

  WiFi.disconnect(true); // wifi
  WiFi.mode(WIFI_STA);
  Serial.println(WiFi.begin(SSID, WPA2_AUTH_PEAP, EAP_IDENTITY, EAP_USERNAME, EAP_PASSWORD));
  //WiFi.begin(TEST_SSID, TEST_PASS);
  //WiFi.begin("eduroam");

  int time;
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
    time++;
    if (time > 30) {
      ESP.restart();
    }
  }

  client.setCACert(SV_ROOT_CERT);
  client.connect(SV_AUTHORITY, 443);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    BLEScanResults foundDevices = pBLEScan->start(10); // scan seconds
    int cnt = foundDevices.getCount(); // actually get data
    for (int i = 0; i < cnt; i++) {
      BLEAdvertisedDevice d = foundDevices.getDevice(i);
      //final += "{\"mac\":\"" + String(d.getAddress().toString().c_str()) + "\",\"rssi\":\"" + String(d.getRSSI()) + "\"},";
      if (i == cnt - 1) {
         //final.remove(final.length() - 1);
      }
    }

    const String finalUrl =  url +  String(DEVICE_ID) + string1 + String(cnt);
    const String count = String("device count: ") + String(cnt);
    Serial.println(finalUrl);
    Serial.println(count);

    https.begin(client, finalUrl);
    https.addHeader("X-API-Key", "d08b3ad6bd9a04c648577b2e405e3a83da8e7d0e");
    https.addHeader("Content-Type", "application/json");
    https.addHeader("accept", "*/*");
    //Serial.println("{\"device_info\":[]}");
    int code = https.POST("");
    Serial.println(code);
    https.end();

    //esp_wifi_stop();
    //esp_sleep_enable_timer_wakeup(50 * 1000000);
    //esp_deep_sleep_start();
  }
}
