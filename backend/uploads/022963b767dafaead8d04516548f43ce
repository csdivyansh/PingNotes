#include<iostream>
using namespace std;
int main() {
    int t;
    cin >> t;
    int x = 0;
    while(x++ != t) {
        int n;
        cin >> n;
        int one = 0, three = 0, allOnes = 0;
        for(int i = 0; i < n; i++) {
            char ch;
            cin >> ch;
            if(ch == '.') {
                one++;
                if(one == 3) {
                    one -= 3;
                    three++;
                }
            }
            if(ch == '#') {
                allOnes += one;
                one = 0;
            }
        }
        allOnes += one;
        if(three)
            cout << 2 << endl;
        else 
            cout << allOnes << endl;
    }
    return 0;
}
