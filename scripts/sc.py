#coding:utf8

import os,time
# import ConMysql

# 传感器编号
deviceNum = "28-3348d446e2c9"
# 设备记录数据的文件地址
deviceFile ='/sys/bus/w1/devices/' + deviceNum + '/w1_slave'
# 告警温度阈值
warningTemp = 32.5
# 发送告警信息标志
isWarning = False
# 告警信息发送间隔时间,默认10s发送一次
warningInterval = 10
# 告警间隔计数器,间隔一段时间后,重新发送告警信息
warningCount = 0

# 打开并读取文件数据
def readDeviceFile():
    f = open(deviceFile,'r')
    lines = f.readlines()
    f.close()
    return lines

# 解析温度数据
# deviceFile文件中的数据一般如下所示：其中 YES 表明是有效数据,t后面是温度,(t % 1000.0) 就是摄氏度
# 50 05 4b 46 7f ff 0c 10 1c : crc=1c YES
# 50 05 4b 46 7f ff 0c 10 1c t=29875
def readTemp():
    lines = readDeviceFile()
    # 如果第一行末尾不是 YES,则等待0.2s后重复读取,直至读取有效数据为止
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        # 循环继续读
        lines = readDeviceFile()
    # 读取温度
    tempIndex = lines[1].find('t=')
    if tempIndex != -1:
        temp = lines[1][tempIndex + 2:]
        tempC = float(temp)/1000.0
    return tempC

while True:
    temp = readTemp()
    if (temp > warningTemp and not isWarning) :
        isWarning = True
        print('此时温度为 %f C,将要发送告警邮件。' % temp)
        # ConMysql.writeDatebase()
    elif (temp > warningTemp and isWarning):
        warningCount += 1
        if warningCount == warningInterval:
            warningCount = 0
            isWarning = False
        else:
            print('此时温度为 %f C,已经发送告警邮件,持续%d s后再次发送' % temp, warningCount)
    else :
        warningCount = 0
        isWarning = False
        print('此时温度为 %f C,非常安全。' % temp)