#!/usr/bin/python
'''
Created on Sep 18, 2014

@author: ekoval
'''

#import libled
#import libbutton
import time
import datetime
from sensor import Led, Button, Mic
from connection import Connection

led = Led(8)
but = Button(6)
mic = Mic(0)
mic.num_of_spikes = 0

print "-I- connecting to server..."
conn = Connection()
conn.connect()
print "-I- connecting to server - done!"

def util_print_args_kwargs(args,kwargs):
    print "-D- *args={}".format(args)
    print "-D- **kwargs={}".format(kwargs)  

def button_handler_led_switch(*args, **kwargs):
    util_print_args_kwargs(args,kwargs)
    led.switch()

def button_handler_led_same_as_button(*args, **kwargs):
    util_print_args_kwargs(args,kwargs)
    led.write(*but.read())
    
def button_handler_start_stop_count_mic_spikes(*args, **kwargs):
    util_print_args_kwargs(args,kwargs)
    if but.read()[0]: #start
        print "-D- button pressed"
        led.on()
        #mic.start_count_spikes()
        mic.num_of_spikes = 0
        print "-D- num of spikes={}".format(mic.num_of_spikes)
    else:#stop
        print "-D- button released"
        led.off()
        #mic.stop_count_spikes()
        print "-I- num of spikes={}".format(mic.num_of_spikes)
        if mic.num_of_spikes:
            print "-I- sending file to server..."
            dummy_file = open('dummy.txt')
            try:
                conn.upload_file(dummy_file, "num_of_spikes={}".format(mic.num_of_spikes))
                print "-I- sending file to server - done!"
            except Exception as e:
                print "-E- failed to send the file because {}".format(e)
    
#but.setCallback(callback = led.switch, callback_arg = led) #led.switch) #DOES NOT WORK NO MATTER HOW I TRY
#but.setCallback(callback = button_handler_led_same_as_button, callback_arg = "kuku") #'kuku' does not seem to be passed anywhere
but.setCallback(callback = button_handler_start_stop_count_mic_spikes, callback_arg = "kuku") #'kuku' does not seem to be passed anywhere

PEAK_THRESHOLD = 500
SPIKE_THRESHOLD = 800
BITRATE = 100000
is_peak = False
peak_list = []
recent_values_list = []
while(True):
    #print "Led read={}".format(led.read())
    #print "But read={}".format(but.read())
    #print "Mic read={}".format(mic.read())
    #print mic.read()
    #last_sound_volume = mic.sound_volume
    mic.sound_volume = mic.getVolume()
    recent_values_list.append(mic.sound_volume)
    if len(recent_values_list)>100:
        recent_values_list.pop(0)
    assert(len(recent_values_list)<=100)
    average = sum(recent_values_list)/len(recent_values_list)
#     if is_peak:
#         print "-D- mic.sound_volume={}".format(mic.sound_volume)
    #print "-D- sound_volume={}".format(sound_volume)
    if mic.sound_volume > PEAK_THRESHOLD:
        #print "-D- HIGH sound_volume={}".format(mic.sound_volume)
        #if last_sound_volume<=PEAK_THRESHOLD:
        if not is_peak:
            #print "-D- last_sound_volume={}".format(last_sound_volume)
            # PEAK BEGIN
            is_peak = True
            peak_list = []
            #peak_list_time = []
        if is_peak:
            #print "-D- mic.sound_volume={}".format(mic.sound_volume)
            peak_list.append(mic.sound_volume)
            #peak_list_time.append(datetime.datetime.now())  
    #elif last_sound_volume > PEAK_THRESHOLD:
    elif is_peak:
        # PEAK END
        is_peak = False
        if len(peak_list)>=3 and max(peak_list)>SPIKE_THRESHOLD:
            # IT'S A SPIKE!
            print "-D- peak_list={}".format(peak_list)
            print "-D- recent average={}".format(average)
            #print "-D- peak_list_time={}".format(peak_list_time)
            mic.num_of_spikes +=1
    time.sleep(1/BITRATE)

