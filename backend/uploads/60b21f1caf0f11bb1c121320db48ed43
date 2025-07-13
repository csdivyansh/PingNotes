#include<iostream>
#include<vector>
#include<limits.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ans = 1;
    if(n == 1) {
        cin >> ans;
        if(ans < 0) {
            ans *= -1;
        } else {
            ans *= 1;
        }
        cout << ans << endl;
        return 0;
    } else {
        vector<int> arr(n);
        int minn = INT_MAX;
        for(int i = 0; i < n; i++) {
            cin >> arr[i];
            if(arr[i] == 0) ans = 0;
            minn = min(minn, abs(arr[i]));
        }
        if(ans == 0) {
            cout << 0 << endl;
            return 0;
        }
        cout << minn << endl;
    }
    return 0;
}
