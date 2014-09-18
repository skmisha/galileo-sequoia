'''
Created on Sep 18, 2014
@author: ekoval
'''
import time
import mraa

class Sensor(object):
    pass

class SensorGpio(Sensor):
    def __init__(self, slot_number, direction = mraa.DIR_IN):
        '''
        @param slot_number: int, number of slot that lED is connected to
        '''
        self.gpio0 = mraa.Gpio(slot_number)
        self.gpio1 = mraa.Gpio(slot_number+1)
        self.gpio0.dir(direction)
        self.gpio1.dir(direction)

    def read(self):
        return self.gpio0.read(),self.gpio1.read()

    def write(self, pin0 = None, pin1 = None):
        if pin0 is not None:
            self.gpio0.write(pin0)
        if pin1 is not None:
            self.gpio1.write(pin1)

class SensorAio(Sensor):
    def __init__(self, slot_number):
        '''
        @param slot_number: int, number of slot that lED is connected to
        '''
        self.aio0 = mraa.Aio(slot_number)
        self.aio1 = mraa.Aio(slot_number+1)

    def read(self):
        return self.aio0.read(),self.aio1.read()

#     def write(self, pin0 = None, pin1 = None):
#         if pin0 is not None:
#             self.gpio0.write(pin0)
#         if pin1 is not None:
#             self.gpio1.write(pin1)




class Led(SensorGpio):
    '''
    @summary: Led controlled
    '''
    def __init__(self,slot_number):
        '''
        @param slot_number: int, number of slot that lED is connected to
        '''
        SensorGpio.__init__(self,slot_number, mraa.DIR_OUT)
        self.off()
        
    def on(self):
        #self.gpio0.write(1)
        #self.gpio1.write(1)
        self.write(1,1)
        self.is_on = True

    def off(self):
        #self.gpio0.write(0)
        #self.gpio1.write(0)
        self.write(0,0)
        self.is_on = False
    
    def switch(self, *args,**kwargs):
        #print "*args={}".format(args)
        #print "**kwargs={}".format(kwargs)
        if self.is_on:
            self.off()
        else:
            self.on()
            
class Button(SensorGpio):
    '''
    @summary: Push Button controller
    '''
    def __init__(self, slot_number):
        '''
        @param slot_number: int, number of slot that lED is connected to
        '''
        SensorGpio.__init__(self,slot_number)
        #self.is_pressed = False
    
    def setCallback(self, callback = None, callback_arg = None):
#         if callback is None:
#             def print_args(args):
#                 print "args={}".format(args)
#             callback = print_args 
        self.gpio0.isr(mraa.EDGE_BOTH, callback, callback_arg)


class Mic(SensorAio):
    def __init__(self, slot_number):
        '''
        @param slot_number: int, number of slot that lED is connected to
        '''
        SensorAio.__init__(self,slot_number)
        #self.do_count_spikes = False
        #self.num_of_spikes = 0
        self.sound_volume = 0
    
#     def start_count_spikes(self):
#         print "-D- start_count_spikes()"
#         self.num_of_spikes = 0
#         self.do_count_spikes = True
#         while(self.do_count_spikes):
# #             sound_volume = self.read()[1]
# #             print "-D- sound_volume={}".format(sound_volume)
# #             if sound_volume > 10:
# #                 print "-D- sound_volume={}".format(sound_volume)
# #                 self.num_of_spikes +=1
#             time.sleep(0.1)
#         return
#     
#     def stop_count_spikes(self):
#         print "-D- stop_count_spikes()"
#         self.do_count_spikes = False
#     
#     def getNumOfSpikes(self):
#         return self.num_of_spikes

    def getVolume(self):
        return self.read()[0]