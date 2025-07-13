#include<iostream>
using namespace std;
#define ll long long
int main() {    
    int t;
    cin >> t;
    while(t--) {
        ll n, k;
        cin >> n >> k;
        bool ans = 0;
        if(k == n) ans = 1;
        else if(n % 2 == 0) ans = 1;
        else if( (n - k) % 2 == 0) ans = 1;
        else ans = 0;
        cout << (ans ? "YES" : "NO") << endl;
    }
    return 0;
}
