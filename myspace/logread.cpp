// a simple program that can be suid'd to read a log file
#include <iostream>
#include <iomanip>
#include <fstream>
#include <cstdlib>
#include <sstream>

using namespace std;

static inline string IntTypeToStr(int x){
    std::ostringstream o;
    if (!(o << x))
         printf("Error in conversion from int to string \n");
    return o.str();
}


int main() {
    int sum = 0;
  //  char * buf;
//    string dynfilename;
    
     char c;

    
 //   buf = new char[1024];  
    //ifstream inFile;
    
    ifstream dynFile;
    dynFile.open("/var/log/httpd/jrm.log");    
    
    // do the printing
    if (!dynFile) {
      //cout << "Unable to open file" <<dynfilename << endl;
    }
    else
    	dynFile.get(c);
      do {
   		 putchar (c);
  		} while (dynFile.get(c));
#if 0    
	    while(dynFile.getline(buf, 1024)){
	   	cout << buf << endl;
	  }
#endif	   	
	    
	    
	    
    //end printing
    
    dynFile.close();   
    
/*    
    ifstream inFile("/var/log/httpd/jrm.log", ios::in);
    if (!inFile) {
        cout << "Unable to open file";
        exit(1); // terminate with error
    }
    while(inFile.good()){
  
    	inFile.readsome(buf, 1024);
    	cout << buf << endl;
    }
    inFile.close();
 */
		// get length of file:
	/*	
		long length;
		char* buffer;
		ifstream is("/var/log/httpd/jrm.log", ios::in);
		is.seekg (0, ios::end);
		length = is.tellg();
		is.seekg (0, ios::beg);
		
		buffer = new char [1024];
		for(long i = 0; i <= length; i+= 1024)
		
		
		// read data as a block:
		is.read (buffer,1024);
		
		is.close();
		
		cout.write (buffer,length);
    */
    /*char str[2000];
    fstream file_op("/var/log/httpd/jrm.log",ios::in);
    while(file_op >> str)
    cout << str <<endl;
		file_op.close();*/
    //now do the others until open fails
 /*   
		bool status = true;
    for(int count = 1; count <= 10 && status; count++){  
    	ifstream dynFile;
    	
    	dynfilename = "/var/log/httpd/jrm.log." + IntTypeToStr(count);
    	dynFile.open(dynfilename.c_str());    
      
      // do the printing
      if (!dynFile) {
        //cout << "Unable to open file" <<dynfilename << endl;
        status = false;
	    }
	    else
		    while(dynFile.getline(buf, 1024)){
		    	cout << buf << endl;
		    }
      //end printing
      
      dynFile.close();     
    }
    
 
    */
    
    return 0;
}
